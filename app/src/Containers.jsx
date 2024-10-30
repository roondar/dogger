import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Progress } from "@nextui-org/react";

import { formatSize } from "./utils";

export default function Containers({ initialized }) {
    const [containers, setContainers] = useState([]);
    const [stats, setStats] = useState({});

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

