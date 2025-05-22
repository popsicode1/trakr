
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryStats } from '@/lib/types';
import { defaultCategories } from '@/lib/data';

interface CategoryPieChartProps {
  summary: SummaryStats;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      color: string;
    };
  }>;
}

const CHART_COLORS = [
  '#3182CE', // blue
  '#38A169', // green
  '#E53E3E', // red
  '#805AD5', // purple
  '#DD6B20', // orange
  '#38B2AC', // teal
  '#D69E2E', // yellow
  '#667EEA', // indigo
  '#F56565', // light red
  '#48BB78', // light green
  '#4299E1', // light blue
  '#9F7AEA', // light purple
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow rounded border text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-gray-700">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ summary }) => {
  // Prepare data for the pie chart
  const pieData = Object.entries(summary.categoryTotals).map(([categoryId, amount]) => {
    const category = defaultCategories.find(c => c.id === categoryId);
    return {
      name: category ? category.name : categoryId,
      value: amount,
      color: category ? category.color : '#CBD5E0',
    };
  }).filter(item => item.value > 0);

  // If no data, show placeholder
  if (pieData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
