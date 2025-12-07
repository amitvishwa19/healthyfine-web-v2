import React from 'react'
import { Plus, Calendar, FileText, UserPlus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
    {
        label: "New Appointment",
        icon: Calendar,
        variant: "outline",
    },
    {
        label: "Add Patient",
        icon: UserPlus,
        variant: "outline",
    },
    {
        label: "Write Prescription",
        icon: FileText,
        variant: "outline",
    },
    {
        label: "Start Consultation",
        icon: Stethoscope,
        variant: "outline",
    },
];


export default function QuickActions() {
    return (
        <div className="rounded-xl border border-border/50 bg-card dark:bg-darkSecondaryBackground p-5 shadow-card animate-slide-up" style={{ animationDelay: "400ms" }}>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                    <Button
                        key={action.label}
                        variant={action.variant}
                        className="h-auto flex-col gap-2 py-4"
                    >
                        <action.icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}
