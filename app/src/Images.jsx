import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

import { formatSize } from "./utils"

export default function Images() {

    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8595/api/images")
            .then((res) => res.json())
            .then((json) => {
                console.log("images->", json);
                if (json.data) setImages(json.data);
            });

    }, []);

    return (
        <Table isStriped aria-label="images table">
            <TableHeader>
                <TableColumn>Image</TableColumn>
                <TableColumn>Size</TableColumn>
                <TableColumn>Created</TableColumn>
            </TableHeader>
            <TableBody>
                {images.map((image) => (
                    <TableRow key={image.Id}>
                        <TableCell className="flex flex-col items-start">
                            <h3 className="font-bold">{image.RepoTags[0] ? image.RepoTags[0] : "<untagged>"}</h3>
                            <p className="text-xs">{image.Id.split(":")[1].slice(0, 12)}</p>
                        </TableCell>
                        <TableCell>{formatSize(image.Size)}</TableCell>
                        <TableCell>{formatDate(image.Created)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    function formatDate(date) {
        return new Date(date * 1000).toLocaleString();
    };
}