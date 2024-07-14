# Swaliga Foundation App made by Hack4Impact-UMD

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd swaliga-foundation-app

2. **Install Dependencies**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000 with your browser to see the result.
```

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

# Overview of the Swaliga Foundation App

The Swaliga Foundation App is designed to streamline interactions between students and staff, facilitate data collection and analysis, and provide various functionalities to enhance the overall user experience. Below is a high-level overview of its key features:

## Student Functions
- **Profile Data Entry**: Students can enter personal information such as their name, city, school, parent contact information, etc.
- **Surveys**: Students can participate in surveys before and after participating in programs.
- **Student ID Login**: Each student is assigned a student ID number, which serves as their username for logging into the portal.


## Staff Functions
- **Student Outreach**: Staff can routinely reach out to students after they complete programs, prompting them to update their profiles with new information.
- **Email Nudges**: Staff can send emails to select students via the admin dashboard, encouraging them to engage with the platform.
- **Manual Data Entry**: Swaliga Foundation personnel can manually enter/modify student information.
- **Survey Administration**: Staff can administer surveys before and after programs.

## Data Collection & Analysis
- **Integrated Forms**: The platform integrates with Google Forms, allowing forms to be created and managed within the Admin's Google Drive.
- **Data Export**: Data collected through the platform can be exported into spreadsheets for manual data analysis.

## User Types

### Student Account
- **Permissions**: Students can edit their information, answer surveys, and create portfolios of their experiences in Swaliga programs.

### Admin / Swaliga Foundation Account
- **Permissions**: Admin users have access to the admin dashboard, where they can view all student accounts, send email nudges to graduated and current students, distribute surveys to specific students, edit student information, and access website data and metrics. They can also export data to spreadsheets for further analysis.