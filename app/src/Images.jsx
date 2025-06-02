import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Card, CardBody } from "@nextui-org/react";

import { formatSize } from "./utils"

export default function Images() {

    const [images, setImages] = useState([]);
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
        fetch("./api/images", {headers: {Authorization: `Bearer ${key}`}})
            .then((res) => res.json())
            .then((json) => {
                console.log("images->", json);
                if (json.data) setImages(json.data);
            });

    }, []);

    return (
        <div className="w-full">
            {isMobile ? (
                // Mobile Card View
                <div className="space-y-4 px-1">
                    {images.map((image) => (
                        <Card key={image.Id} className="w-full">
                            <CardBody className="p-4">
                                <div className="flex flex-col space-y-4">
                                    <div>
                                        <h3 className="font-bold text-base truncate">
                                            {image.RepoTags[0] ? image.RepoTags[0] : "<untagged>"}
                                        </h3>
                                        <p className="text-xs text-gray-500">{image.Id.split(":")[1].slice(0, 12)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Size</p>
                                            <p className="text-sm">{formatSize(image.Size)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Created</p>
                                            <p className="text-sm">{formatDate(image.Created)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                // Desktop Table View
                <div className="overflow-x-auto">
                    <Table isStriped aria-label="images table">
                        <TableHeader>
                            <TableColumn>Image</TableColumn>
                            <TableColumn>Size</TableColumn>
                            <TableColumn>Created</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {images.map((image) => (
                                <TableRow key={image.Id}>
                                    <TableCell className="min-w-0">
                                        <div className="flex flex-col items-start">
                                            <h3 className="font-bold truncate max-w-64">{image.RepoTags[0] ? image.RepoTags[0] : "<untagged>"}</h3>
                                            <p className="text-xs">{image.Id.split(":")[1].slice(0, 12)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatSize(image.Size)}</TableCell>
                                    <TableCell>{formatDate(image.Created)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )

    function formatDate(date) {
        return new Date(date * 1000).toLocaleString();
    };
}