import { Avatar } from "@comp/avatar";
import { Card } from "@comp/card";
import { Input } from "@comp/input";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/_components/client/button";

const Sidebar = () => (
	<div className="col-span-12 space-y-6 lg:col-span-3">
		<Card className="rounded-3xl p-6">
			<h4 className="font-bold">OUR TEAM</h4>
			<p className="mt-1 text-muted-foreground text-sm">
				Our Team designs luxurious minimalist{" "}
				<span className="font-semibold text-primary">furniture.</span>
			</p>
			<div className="mt-4 flex items-center space-x-2">
				<div className="-space-x-3 flex">
					<Avatar className="border-2 border-background">
						<AvatarImage src="https://i.pravatar.cc/150?img=1" />
					</Avatar>
					<Avatar className="border-2 border-background">
						<AvatarImage src="https://i.pravatar.cc/150?img=2" />
					</Avatar>
					<Avatar className="border-2 border-background">
						<AvatarImage src="https://i.pravatar.cc/150?img=3" />
					</Avatar>
				</div>
			</div>
		</Card>

		<Card className="rounded-3xl p-6">
			<h4 className="font-bold">GET A BONUS</h4>
			<p className="mt-1 text-muted-foreground text-sm">
				Discover our latest exclusive deals.
			</p>
			<div className="mt-4 flex items-center">
				<Input placeholder="Email" className="rounded-r-none" />
				<Button className="rounded-l-none">Subscribe</Button>
			</div>
		</Card>

		<Card className="rounded-3xl p-6">
			<h4 className="font-bold">OUR TEAM</h4>
			<p className="mt-1 text-muted-foreground text-sm">
				Join us, stay tuned for more news and share{" "}
				<span className="font-semibold text-primary">your thoughts.</span>
			</p>
		</Card>
	</div>
);
export default Sidebar;
