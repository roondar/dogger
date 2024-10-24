import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Progress } from "@nextui-org/progress";
import { formatSize } from "./utils";

export default function Containers() {

    const [containers, setContainers] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetch("http://127.0.0.1:8595/api/containers")
            .then((res) => res.json())
            .then((json) => {
                console.log("containers->", json);
                if (json.data) setContainers(json.data);
            });

    }, []);

    useEffect(() => {
        containers.filter((c) => c.State === "running").forEach((c) => {
            fetch(`http://127.0.0.1:8595/api/containers/${c.Id}/stats`)
                .then((res) => res.json())
                .then((json) => {
                    console.log("container stats->", json);
                    if (json.data) setStats(prevStats => ({
                        ...prevStats,
                        [json.data.id]: {
                            cpu_usage: getCpuUsage(json.data),
                            used_memory: json.data.memory_stats?.usage - json.data.memory_stats?.stats?.cache || 0,
                            memory_limit: json.data.memory_stats.limit,
                        }
                    }));
                });
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
                        <TableCell  className="w-64">{container.Status}</TableCell>
                        <TableCell className="w-48">
                            {container.Ports.filter((p) => !!p.PublicPort).map((port) =>
                                <p key={`${port.PublicPort} -> ${port.PrivatePort}`}>{`${port.Type}: ${port.PublicPort} -> ${port.PrivatePort}`}</p>
                            )}

                        </TableCell>
                        <TableCell className="w-48">
                            {stats[container.Id] ?
                                <Progress value={stats[container.Id].cpu_usage} label={`${stats[container.Id].cpu_usage.toFixed(2)}%`} classNames={{label: "text-xs"}}/>
                                : <p>NA</p>}
                        </TableCell>
                        <TableCell className="w-48">
                            {stats[container.Id] ?
                                <Progress showValueLabel={true} label={`${formatSize(stats[container.Id].used_memory)}/${formatSize(stats[container.Id].memory_limit)}`} value={stats[container.Id].used_memory / stats[container.Id].memory_limit * 100}  classNames={{label: "text-xs", value: "text-xs"}}/>
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

