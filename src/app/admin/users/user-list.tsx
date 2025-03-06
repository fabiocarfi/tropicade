"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateUserRole } from "@/lib/actions/user.action";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function UserList({
  users,
}: {
  users: { id: string; name: string; role: string; email: string }[];
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    if (newRole === "admin") {
      const res = confirm("Are you sure to make this user an Admin?");
      if (!res) return;
    }
    setLoading(true);
    try {
      const res = await updateUserRole(userId, newRole);
      if (!res?.success) {
        toast({
          title: res?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden xs:block">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="hidden xs:block">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Select
                disabled={loading}
                value={user.role}
                onValueChange={(value: "user" | "admin") =>
                  handleRoleChange(user.id, value)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
