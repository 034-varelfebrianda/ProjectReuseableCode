import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  GitBranch,
  AlignHorizontalJustifyCenter,
  FileBarChart2,
  BarChart3,
  Table2,
  Sheet,
  FileText,
  CalendarDays,
  ListTree,
  RectangleEllipsis,
  PanelsTopLeft,
} from "lucide-react";

export type ComponentItem = {
  title: string;
  description: string;
  demos: number;
  icon: LucideIcon;
};

export const componentsData:ComponentItem[]=[
    {title: "Grid",
    description: "Sort, filter, group, and paginate large datasets.",
    demos: 12,
    icon: LayoutGrid,
    },{
        title: "Diagram",
        description: "Design and modify diagrams with 40+ resizable shapes.",
        demos: 7,
        icon:GitBranch
    },{
        title: "Gantt",
        description: "Visualize project schedules with task dependencies.",
        demos:5,
        icon:AlignHorizontalJustifyCenter
    },{
        title: "Reporting",
        description: "Create, customize, and export rich reports.",
        demos: 8 ,
        icon:FileBarChart2 ,
    },{
        title:"Charting" ,
        description: "Line, bar, pie, area charts with real-time data.",
        demos:10 ,
        icon:BarChart3 ,
    },{
        title:"Pivot Grid",
        description: "Multi-dimensional data analysis and cross-tabulation.",
        demos:6 ,
        icon:Table2 ,
    },{
        title:"Spreadsheet" ,
        description: "Excel-like editing with formulas and cell formatting.",
        demos:4 ,
        icon:Sheet ,
    },{
        title: "Rich Text Editor",
        description: "Full-featured document editor with formatting.",
        demos: 6,
        icon: FileText,
    },{
        title: "Scheduling",
        description: "Calendar views with drag-and-drop event management.",
        demos: 5,
        icon:CalendarDays ,
    },{
        title: "Tree List",
        description: "Hierarchical data display with expand and collapse.",
        demos: 4,
        icon:ListTree ,
    },{
        title: "Data Editors",
        description:"Input, select, date, and multi-select editors. " ,
        demos: 9,
        icon:RectangleEllipsis ,
    },{
        title:" Navigation and Layout" ,
        description:"Sidebars, tabs, toolbars, and page layouts." ,
        demos: 5,
        icon:PanelsTopLeft ,
    }
    
    ]