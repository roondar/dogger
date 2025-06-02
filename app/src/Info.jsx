import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Card, CardBody } from "@nextui-org/react";
import packageJson from '../package.json';

export default function Info() {

    const [info, setInfo] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    // Check if screen is mobile size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const key = sessionStorage.getItem("dogger-key");
        fetch("./api/version", { headers: { Authorization: `Bearer ${key}` } })
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
        <div className="w-full">
            {isMobile ? (
                // Mobile Card View
                <div className="space-y-3 px-1">
                    {info.map((item) => (
                        <Card key={item.key} className="w-full">
                            <CardBody className="p-4">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-xs text-gray-500 font-medium">{item.key}</p>
                                    <p className="text-sm break-all">{item.value}</p>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                // Desktop Table View
                <div className="overflow-x-auto">
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
                </div>
            )}
        </div>
    )

}
