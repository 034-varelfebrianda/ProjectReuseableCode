export interface MailItem {
    id: number;
    from : string;
    subject: string,
    sent: string;
    attachment: boolean;
    size: string;
}

export const LargeDataBase:MailItem[]=[
    {id:1 ,
    from:"Tom Murrel" ,
    subject: "Welcome to the team",
    sent:"2/21/2016",
    attachment:true ,
    size:"156 KB"
},
    {id:2 ,
    from:"Ray Barnes" ,
    subject: "Receivables Calculator. Where can I find the complete specs?",
    sent:"2/22/2016",
    attachment:true ,
    size:"116 KB"
},
    {id:3 ,
    from:"Dave Parkins" ,
    subject: "Email System. What library are we going to use?",
    sent:"2/22/2016",
    attachment: true,
    size:"266 KB"
},
    {id:4 ,
    from:"Ryan Murrel" ,
    subject: "Payables Due Calculator is ready for testing.",
    sent:"2/22/2016",
    attachment:false ,
    size:"15 KB"
},
    {id:5 ,
    from:"Carl Barnes" ,
    subject: "Urgent: Server Down",
    sent:"2/23/2016",
    attachment:false ,
    size:"44 KB"
},
    {id:6 ,
    from:"Brad Parkins" ,
    subject: "Drag & Drop operations are not available in the scheduler module.",
    sent:"2/23/2016",
    attachment: true,
    size:"123 KB"
},
    {id:7 ,
    from:"James Murrel" ,
    subject: "Main Menu: Add a File menu. File menu item is missing.",
    sent:"2/23/2016",
    attachment:false ,
    size:"89 KB"
},
    {id:8 ,
    from:"John Barnes" ,
    subject: "Integrating Developer Express MasterView control into an Accounting System.",
    sent:"2/23/2016",
    attachment: true,
    size:"170 KB"
},
    {id:9 ,
    from:"Bert Parkins" ,
    subject: "Email Attachments. Is it possible to add multiple attachments? I haven't found a way to do this.",
    sent:"2/24/2016",
    attachment: false,
    size:"16 KB"
},
    {id:10 ,
    from:"Tom Murrel" ,
    subject: "Welcome to the team",
    sent:"2/24/2016",
    attachment: true,
    size:"112 KB"
},
]