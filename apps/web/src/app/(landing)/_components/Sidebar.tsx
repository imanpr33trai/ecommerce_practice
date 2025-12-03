import { Button } from "@/_components/client/button";
import { Card } from "@comp/card";
import { Input } from "@comp/input";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@comp/avatar";

const Sidebar = () => (
    <div className="col-span-12 lg:col-span-3 space-y-6">
        <Card className="rounded-3xl p-6">
            <h4 className="font-bold">OUR TEAM</h4>
            <p className="text-muted-foreground text-sm mt-1">Our Team designs luxurious minimalist <span className="text-primary font-semibold">furniture.</span></p>
            <div className="flex items-center space-x-2 mt-4">
                <div className="flex -space-x-3">
                    <Avatar className="border-2 border-background"><AvatarImage src="https://i.pravatar.cc/150?img=1" /></Avatar>
                    <Avatar className="border-2 border-background"><AvatarImage src="https://i.pravatar.cc/150?img=2" /></Avatar>
                    <Avatar className="border-2 border-background"><AvatarImage src="https://i.pravatar.cc/150?img=3" /></Avatar>
                </div>
            </div>
        </Card>

        <Card className="rounded-3xl p-6">
            <h4 className="font-bold">GET A BONUS</h4>
            <p className="text-muted-foreground text-sm mt-1">Discover our latest exclusive deals.</p>
            <div className="flex items-center mt-4">
                <Input placeholder="Email" className="rounded-r-none" />
                <Button className="rounded-l-none">Subscribe</Button>
            </div>
        </Card>

        <Card className="rounded-3xl p-6">
            <h4 className="font-bold">OUR TEAM</h4>
            <p className="text-muted-foreground text-sm mt-1">Join us, stay tuned for more news and share <span className="text-primary font-semibold">your thoughts.</span></p>
        </Card>
    </div>
);
export default Sidebar