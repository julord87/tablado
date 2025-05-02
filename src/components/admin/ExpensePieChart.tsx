"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";    

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF00FF", "#00FFFF", "#FF4500", "#FFD700", "#ADFF2F", "#7FFF00"];

interface Props {
    data: { type: string; amount: number }[];
}

export function ExpensePieChart({ data }: Props) {
    const total = useMemo(() => data.reduce((sum, d) => sum + d.amount, 0), [data]);

    return (
        <div className="w-full h-96 font-sans">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€ ${Number(value).toFixed(2)}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-sm text-muted-foreground mt-2">
                Total del año: € {total.toFixed(2)}
            </div>
        </div>
    );
}