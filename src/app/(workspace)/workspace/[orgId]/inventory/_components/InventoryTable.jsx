import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertTriangle } from "lucide-react";




export const InventoryTable = ({ inventory, onEdit, onDelete }) => {
    const getStockStatus = (item) => {
        if (item.quantity === 0) return { label: "Out of Stock", variant: "destructive" };
        if (item.quantity < item.minStock) return { label: "Low Stock", variant: "destructive" };
        if (item.quantity < item.minStock * 1.5) return { label: "Warning", variant: "secondary" };
        return { label: "In Stock", variant: "default" };
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expiry <= threeMonthsFromNow;
    };

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden dark:bg-darkSecondaryBackground w-full p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Last Restocked</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventory.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                No inventory items found
                            </TableCell>
                        </TableRow>
                    ) : (
                        inventory.map((item) => {
                            const status = getStockStatus(item);
                            const expiringSoon = isExpiringSoon(item.expiryDate);

                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.quantity} {item.unit}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={status.variant}>{status.label}</Badge>
                                    </TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>
                                        {item.expiryDate ? (
                                            <div className="flex items-center gap-1">
                                                {expiringSoon && <AlertTriangle className="h-4 w-4 text-destructive" />}
                                                <span className={expiringSoon ? "text-destructive" : ""}>
                                                    {new Date(item.expiryDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.supplier}</TableCell>
                                    <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(item.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};