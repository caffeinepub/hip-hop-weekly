import {
  Eye,
  Globe,
  Inbox,
  Lightbulb,
  Music,
  Newspaper,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    label: "Rundown Stories",
    desc: "Add and manage weekly news stories",
    to: "/admin/rundown",
    icon: Newspaper,
  },
  {
    label: "Watch List",
    desc: "Update the featured artist spotlight",
    to: "/admin/watchlist",
    icon: Eye,
  },
  {
    label: "Underground Scene",
    desc: "Manage regional artist highlights",
    to: "/admin/underground",
    icon: Globe,
  },
  {
    label: "Beat Charts",
    desc: "Update the weekly beat rankings",
    to: "/admin/beats",
    icon: Music,
  },
  {
    label: "Producer Tips",
    desc: "Publish tips from producers",
    to: "/admin/tips",
    icon: Lightbulb,
  },
  {
    label: "Reviews",
    desc: "Write and publish song reviews",
    to: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Song Submissions",
    desc: "Review artist submissions",
    to: "/admin/submissions",
    icon: Inbox,
  },
  {
    label: "Subscribers",
    desc: "View newsletter subscriber list",
    to: "/admin/subscribers",
    icon: Users,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-foreground uppercase text-3xl tracking-tight mb-1">
          Content Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage all weekly publication content from here.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ label, desc, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="bg-card border border-border rounded-sm p-6 hover:border-gold-dark transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center group-hover:bg-gold transition-colors">
                <Icon
                  size={18}
                  className="text-muted-foreground group-hover:text-[oklch(0.10_0_0)] transition-colors"
                />
              </div>
              <span className="font-display font-bold text-foreground group-hover:text-gold transition-colors">
                {label}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
