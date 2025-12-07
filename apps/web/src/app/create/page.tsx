"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@workspace/ui/components/table";
// UI Components
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you use sonner or similar
import { Button } from "@/_components/client/button";
import { queryClient, trpc } from "@/utils/trpc"; // Your tRPC client import

// --- 1. PRODUCT TAB COMPONENT ---
function ProductTab() {
	// const utils = trpc.useUtils();
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({ name: "", price: 0, stock: 0 });

	// Fetch Data
	const { data, isLoading } = useQuery(
		trpc.product.list.queryOptions({ limit: 20, offset: 0 }),
	);

	// Mutations
	const createMutation = useMutation(
		trpc.product.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.refetchQueries(
					trpc.product.list.queryOptions({ limit: 20, offset: 0 }),
				);
				setIsOpen(false);
				toast.success("Product created");
				setFormData({ name: "", price: 0, stock: 0 });
			},
		}),
	);

	const deleteMutation = useMutation(
		trpc.product.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.refetchQueries(
					trpc.product.list.queryOptions({ limit: 20, offset: 0 }),
				);
				toast.success("Product deleted");
			},
		}),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate({
			name: formData.name,
			price: Number(formData.price),
			stock: Number(formData.stock),
			// Add other required fields from your schema here
		});
	};

	if (isLoading)
		return (
			<div>
				<Loader2 className="animate-spin" /> Loading products...
			</div>
		);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Products</CardTitle>
					<CardDescription>Manage your store inventory</CardDescription>
				</div>

				{/* CREATE PRODUCT MODAL */}
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" /> Add Product
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Product</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Name</Label>
								<Input
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Price</Label>
									<Input
										type="number"
										value={formData.price}
										onChange={(e) =>
											setFormData({
												...formData,
												price: Number(e.target.value),
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label>Stock</Label>
									<Input
										type="number"
										value={formData.stock}
										onChange={(e) =>
											setFormData({
												...formData,
												stock: Number(e.target.value),
											})
										}
										required
									/>
								</div>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={createMutation.isPending}
							>
								{createMutation.isPending ? "Creating..." : "Save Product"}
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</CardHeader>

			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.products.map((product) => (
							<TableRow key={product.id}>
								<TableCell className="font-medium">{product.name}</TableCell>
								<TableCell>${Number(product.price).toFixed(2)}</TableCell>
								<TableCell>{product.stock}</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteMutation.mutate({ id: product.id })}
									>
										<Trash2 className="h-4 w-4 text-red-500" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

// --- 2. CATEGORY TAB COMPONENT ---
function CategoryTab() {
	// const utils = trpc.useUtils();
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");

	const { data, isLoading } = useQuery(trpc.category.getRoots.queryOptions()); // Or list

	const createMutation = useMutation(
		trpc.category.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.refetchQueries(
					trpc.product.list.queryOptions({ limit: 20, offset: 0 }),
				);
				setIsOpen(false);
				setName("");
				toast.success("Category created");
			},
		}),
	);

	const deleteMutation = useMutation(
		trpc.category.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.refetchQueries(
					trpc.product.list.queryOptions({ limit: 20, offset: 0 }),
				);
				toast.success("Category deleted");
			},
		}),
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Categories</CardTitle>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button variant="outline">
							<Plus className="mr-2 h-4 w-4" /> Add Category
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>New Category</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Name</Label>
								<Input value={name} onChange={(e) => setName(e.target.value)} />
							</div>
							<Button
								onClick={() => createMutation.mutate({ name })}
								disabled={createMutation.isPending}
							>
								Create
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((category) => (
							<TableRow key={category.id}>
								<TableCell>{category.name}</TableCell>
								<TableCell className="text-gray-500">{category.slug}</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteMutation.mutate({ id: category.id })}
									>
										<Trash2 className="h-4 w-4 text-red-500" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

// --- 3. ORDER TAB COMPONENT ---
function OrderTab() {
	// const utils = trpc.useUtils();
	// We need a specific 'listAll' for admin, referencing the 'list' (user) or creating a new admin procedure
	// Assuming you create a router `trpc.order.adminList` or similar.
	// For now using the existing structure for demonstration.
	const { data, isLoading } = useQuery(trpc.order.adminList.queryOptions());

	const updateStatusMutation = useMutation(
		trpc.order.updateStatus.mutationOptions({
			onSuccess: async () => {
				await queryClient.refetchQueries(
					trpc.order.adminList.queryOptions({ limit: 20 }),
				);
				toast.success("Order status updated");
			},
		}),
	);

	if (isLoading) return <div>Loading orders...</div>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Orders</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-mono text-xs">{order.id}</TableCell>
								<TableCell>${order.totalAmount}</TableCell>
								<TableCell>
									<span
										className={`rounded px-2 py-1 font-bold text-xs ${
											order.status === "PAID"
												? "bg-green-100 text-green-800"
												: order.status === "PENDING"
													? "bg-yellow-100 text-yellow-800"
													: "bg-gray-100"
										}`}
									>
										{order.status}
									</span>
								</TableCell>
								<TableCell>
									{/* Status Dropdown */}
									<Select
										defaultValue={order.status}
										onValueChange={(val) =>
											updateStatusMutation.mutate({
												orderId: order.id,
												status: val as any,
											})
										}
									>
										<SelectTrigger className="h-8 w-[130px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="PENDING">Pending</SelectItem>
											<SelectItem value="SHIPPED">Shipped</SelectItem>
											<SelectItem value="DELIVERED">Delivered</SelectItem>
											<SelectItem value="CANCELLED">Cancelled</SelectItem>
										</SelectContent>
									</Select>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

// --- MAIN PAGE COMPONENT ---
export default function AdminDashboardPage() {
	return (
		<div className="container mx-auto space-y-8 px-4 py-10">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Manage your products, categories, and orders.
				</p>
			</div>

			<Tabs defaultValue="products" className="space-y-4">
				<TabsList>
					<TabsTrigger value="products">Products</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
					<TabsTrigger value="orders">Orders</TabsTrigger>
				</TabsList>

				<TabsContent value="products" className="space-y-4">
					<ProductTab />
				</TabsContent>

				<TabsContent value="categories" className="space-y-4">
					<CategoryTab />
				</TabsContent>

				<TabsContent value="orders" className="space-y-4">
					<OrderTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}
