import { sdmc, thrasio, smartdove, chinaUnicom } from "../assets/images";
import {
    car,
    contact,
    css,
    estate,
    express,
    git,
    github,
    html,
    javascript,
    linkedin,
    mongodb,
    motion,
    mui,
    nextjs,
    nodejs,
    pricewise,
    react,
    redux,
    sass,
    snapgram,
    summiz,
    tailwindcss,
    threads,
    typescript,
    wechat
} from "../assets/icons";

export const skills = [
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: html,
        name: "HTML",
        type: "Frontend",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Frontend",
    },
    {
        imageUrl: mongodb,
        name: "MongoDB",
        type: "Database",
    },
    {
        imageUrl: motion,
        name: "Motion",
        type: "Animation",
    },
    {
        imageUrl: mui,
        name: "Material-UI",
        type: "Frontend",
    },
    {
        imageUrl: nextjs,
        name: "Next.js",
        type: "Frontend",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: redux,
        name: "Redux",
        type: "State Management",
    },
    {
        imageUrl: sass,
        name: "Sass",
        type: "Frontend",
    },
    {
        imageUrl: tailwindcss,
        name: "Tailwind CSS",
        type: "Frontend",
    },
    {
        imageUrl: typescript,
        name: "TypeScript",
        type: "Frontend",
    }
];

export const experiences = [
    {
        title: "The Founder of SMARTDOVE Project",
        company_name: "Student Project in GDUT - Bachelor Degree in Computer Science",
        icon: smartdove,
        iconBg: "#accbe1",
        date: "2017 - 2020",
        points: [
            "SMARTDOVE is an intelligent text converter based on WeChat Mini Programs. It can recognize your text input and optimize it into a more trendy and engaging content.",
            "I am the founder, designer, and operator of the project. At our peak, the team consisted of 20 members and we had over 5,000 monthly active users.",
            "I received the Top Student Entrepreneurship Award from the Guangdong Provincial Government and went to Silicon Valley, USA, for a project roadshow in 2019.",
            "Mastered full-stack engineering skills, leadership abilities, and design expertise.",
        ],
    },
    {
        title: "Technical Project Manager",
        company_name: "China Unicom",
        icon: chinaUnicom,
        iconBg: "#fbc3bc",
        date: "2021 - 2022",
        points: [
            "Responsible for a range of daily support tasks, including installations, deployments, troubleshooting, software upgrades, and compliance checks for hardware and software products such as firewalls, switches, internet behavior management routers, cloud desktops, endpoint security software, and VPN servers.",
            "Proficient in various documentation tools, including WPS, Microsoft Office, and Google Docs, with a commitment to continuously creating and updating technical documentation.",
            "Manage and maintain a variety of electronic devices in the office, including cameras, projectors, microphones, smart TVs, time clock machines, printers, and Wi-Fi routers.",
            "Troubleshoot system software issues, such as connectivity problems on Windows and Mac systems, software crashes, and data loss on disks.",
        ],
    },
    {
        title: "Global Technical Support",
        company_name: "SDMC Technology",
        icon: sdmc,
        iconBg: "#b7e4c7",
        date: "2022 - 2024",
        points: [
            "Provide technical support for projects in over 7 countries worldwide, covering multiple fields such as networking, software, hardware, and Linux servers, among others.",
            "Accountable for customer satisfaction as first priority. Keep updating technical documents and host regular training meetings.",
        ],
    },
    {
        title: "System Administrator",
        company_name: "Thrasio",
        icon: thrasio,
        iconBg: "#a2d2ff",
        date: "2024 - Present",
        points: [
            "Developing engineering applications in the field of AI.",
            "Managing various cloud platforms and services within the company.",
            "Desktop IT support."
            ],
    },
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/lennonkc',
    },
    {
        name: 'WeChat',
        iconUrl: wechat,
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/kuncheng-li',
    },
];

export const projects = [
    {
        iconUrl: pricewise,
        theme: 'btn-back-red',
        name: 'Amazon Price Tracker',
        description: 'Developed a web application that tracks and notifies users of price changes for products on Amazon, helping users find the best deals.',
        link: 'https://github.com/adrianhajdin/pricewise',
    },
    {
        iconUrl: threads,
        theme: 'btn-back-green',
        name: 'Full Stack Threads Clone',
        description: 'Created a full-stack replica of the popular discussion platform "Threads," enabling users to post and engage in threaded conversations.',
        link: 'https://github.com/adrianhajdin/threads',
    },
    {
        iconUrl: car,
        theme: 'btn-back-blue',
        name: 'Car Finding App',
        description: 'Designed and built a mobile app for finding and comparing cars on the market, streamlining the car-buying process.',
        link: 'https://github.com/adrianhajdin/project_next13_car_showcase',
    },
    {
        iconUrl: snapgram,
        theme: 'btn-back-pink',
        name: 'Full Stack Instagram Clone',
        description: 'Built a complete clone of Instagram, allowing users to share photos and connect with friends in a familiar social media environment.',
        link: 'https://github.com/adrianhajdin/social_media_app',
    },
    {
        iconUrl: estate,
        theme: 'btn-back-black',
        name: 'Real-Estate Application',
        description: 'Developed a web application for real estate listings, facilitating property searches and connecting buyers with sellers.',
        link: 'https://github.com/adrianhajdin/projects_realestate',
    },
    {
        iconUrl: summiz,
        theme: 'btn-back-yellow',
        name: 'AI Summarizer Application',
        description: 'App that leverages AI to automatically generate concise & informative summaries from lengthy text content, or blogs.',
        link: 'https://github.com/adrianhajdin/project_ai_summarizer',
    }
];