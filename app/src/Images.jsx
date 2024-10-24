import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

export default function Images() {

    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8595/api/images")
            .then((res) => res.json())
            .then((json) => {
                console.log("images->", json);
                if (json.data) setImages(json.data);
                // setImages(json)
            });

    }, []);

    return (
        <Table isStriped aria-label="images table">
            <TableHeader>
                <TableColumn>image</TableColumn>
                <TableColumn>size</TableColumn>
                <TableColumn>created</TableColumn>
            </TableHeader>
            <TableBody>
                {images.map((image) => (
                    <TableRow key={image.Id}>
                        <TableCell className="flex flex-col items-start">
                            <h3 className="font-bold">{image.RepoTags[0] ? image.RepoTags[0] : "<untagged>"}</h3>
                            <p className="text-xs">{image.RepoDigests[0]}</p>
                        </TableCell>
                        <TableCell>{formatSize(image.Size)}</TableCell>
                        <TableCell>{formatDate(image.Created)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    function formatSize(size) {
        let unit = 'B';
        if (size > 1024) {
            size /= 1024;
            unit = 'KB';
        }
        if (size > 1024) {
            size /= 1024;
            unit = 'MB';
        }
        if (size > 1024) {
            size /= 1024;
            unit = 'GB';
        }
        return `${size.toFixed(2)} ${unit}`;
    };

    function formatDate(date) {
        return new Date(date * 1000).toLocaleString();
    };
}