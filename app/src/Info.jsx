import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import packageJson from '../package.json';

export default function Info() {

    const [info, setInfo] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8595/api/version")
            .then((res) => res.json())
            .then((json) => {
                console.log('version->', json);
                const items = [{ key: 'Dogger Version', value: packageJson.version }];
                if (json.data) {
                    items.push({ key: 'Docker Server Platform', value: json.data?.Platform?.Name });
                    items.push({ key: 'Docker version', value: json.data?.Version });
                    items.push({ key: 'Docker API version', value: json.data?.ApiVersion });
                    items.push({ key: 'Go version', value: json.data?.GoVersion });
                    items.push({ key: 'Git commit', value: json.data?.GitCommit });
                    items.push({ key: 'OS/Arch', value: json.data?.Os + '/' + json.data?.Arch });
                    items.push({ key: 'Kernel version', value: json.data?.KernelVersion });
                    items.push({ key: 'Build time', value: json.data?.BuildTime });
                    for (let component of json.data?.Components) {
                        items.push({ key: component.Name, value: component.Version });
                    }
                }
                console.log('items->', items);
                setInfo(items);
            });
    }, []);

    return (
                <Table aria-label="Version info table">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {info.map((item) => (
                            <TableRow key={item.key}>
                                <TableCell>{item.key}</TableCell>
                                <TableCell>{item.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
    )

}
