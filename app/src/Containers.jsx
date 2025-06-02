import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Progress, Button, ButtonGroup } from "@nextui-org/react";

import { formatSize } from "./utils";

export default function Containers({ initialized }) {
    const [containers, setContainers] = useState([]);
    const [stats, setStats] = useState({});
    const [actionLoading, setActionLoading] = useState({});

    const performContainerAction = async (containerId, action) => {
        setActionLoading(prev => ({ ...prev, [containerId]: action }));
        const key = sessionStorage.getItem("dogger-key");
        
        try {
            const response = await fetch(`./api/containers/${containerId}/${action}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${key}` }
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Refresh the containers list
                const containersResponse = await fetch("./api/containers", { 
                    headers: { Authorization: `Bearer ${key}` } 
                });
                const containersJson = await containersResponse.json();
                if (containersJson.data) setContainers(containersJson.data);
            } else {
                console.error(`Failed to ${action} container:`, result.error);
            }
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        } finally {
            setActionLoading(prev => ({ ...prev, [containerId]: null }));
        }
    };

    useEffect(() => {
        if (initialized) {
            const key = sessionStorage.getItem("dogger-key");
            fetch("./api/containers", { headers: { Authorization: `Bearer ${key}` } })
                .then((res) => res.json())
                .then((json) => {
                    console.log("containers->", json);
                    if (json.data) setContainers(json.data);
                });
        }
    }, [initialized]);

    useEffect(() => {
        const key = sessionStorage.getItem("dogger-key");
        const statPromises = containers.filter((c) => c.State === "running").map(c => {
            return fetch(`./api/containers/${c.Id}/stats`, { headers: { Authorization: `Bearer ${key}` } })
                .then((res) => res.json())
                .then(json => {
                    json.id = c.Id;
                    return json
                });
        });
        Promise.all(statPromises).then(stats => {
            console.log("stats->", stats);
            const newStats = {};
            stats.forEach(stat => {
                if (stat.data) {
                    newStats[stat.id] = {
                        cpu_usage: getCpuUsage(stat.data),
                        used_memory: stat.data.memory_stats?.usage - (stat.data.memory_stats?.stats?.cache || 0),
                        memory_limit: stat.data.memory_stats.limit,
                    }
                }
            });
            setStats(newStats);
        });
    }, [containers])

    return (
        <Table isStriped aria-label="containers table">
            <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Image</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Ports</TableColumn>
                <TableColumn>CPU</TableColumn>
                <TableColumn>Memory</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
                {containers.map((container) => (
                    <TableRow key={container.Id} >
                        <TableCell className="flex flex-col items-start">
                            <h3 className={`font-bold ${container.State === "running" ? "text-green-500" : "text-slate-600"}`}>{container.Names[0].slice(1)}</h3>
                            <p className="text-xs">{container.Id.slice(0, 12)}</p>
                        </TableCell>
                        <TableCell className="text-sm">{container.Image}</TableCell>
                        <TableCell className="w-64">{container.Status}</TableCell>
                        <TableCell className="w-48">
                            {container.Ports.filter((p) => !!p.PublicPort && (!p.IP || p.IP === "0.0.0.0")).map((port) =>
                                <p key={`${port.Type}:${port.PublicPort} -> ${port.PrivatePort}`}>{`${port.Type}: ${port.PublicPort} -> ${port.PrivatePort}`}</p>
                            )}
                        </TableCell>
                        <TableCell className="w-48">
                            {stats[container.Id] ?
                                <Progress value={stats[container.Id].cpu_usage} label={`${stats[container.Id].cpu_usage.toFixed(2)}%`} classNames={{ label: "text-xs" }} />
                                : <p>NA</p>}
                        </TableCell>
                        <TableCell className="w-48">
                            {stats[container.Id] ?
                                <Progress showValueLabel={true} label={`${formatSize(stats[container.Id].used_memory)}/${formatSize(stats[container.Id].memory_limit)}`} value={stats[container.Id].used_memory / stats[container.Id].memory_limit * 100} classNames={{ label: "text-xs", value: "text-xs" }} />
                                : <p>NA</p>}
                        </TableCell>
                        <TableCell className="w-48">
                            <ButtonGroup size="sm" variant="flat">
                                <Button 
                                    color={container.State === "running" ? "danger" : "success"}
                                    isLoading={actionLoading[container.Id] === (container.State === "running" ? "stop" : "start")}
                                    onClick={() => performContainerAction(container.Id, container.State === "running" ? "stop" : "start")}
                                >
                                    {container.State === "running" ? "Stop" : "Start"}
                                </Button>
                                <Button 
                                    color="warning"
                                    isLoading={actionLoading[container.Id] === "restart"}
                                    onClick={() => performContainerAction(container.Id, "restart")}
                                    isDisabled={container.State !== "running"}
                                >
                                    Restart
                                </Button>
                            </ButtonGroup>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    function getCpuUsage(stats) {
        const cpu_delta = stats.cpu_stats?.cpu_usage?.total_usage - (stats.precpu_stats?.cpu_usage?.total_usage || 0);
        const system_cpu_delta = stats.cpu_stats?.system_cpu_usage - (stats.precpu_stats?.system_cpu_usage || 0);
        const cpu_usage = (cpu_delta / system_cpu_delta) * stats.cpu_stats.online_cpus * 100;
        return cpu_usage
    }
}

