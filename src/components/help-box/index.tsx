import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useSession } from '@roq/nextjs';

export const HelpBox: React.FC = () => {
  const ownerRoles = ['Business Owner'];
  const roles = ['Business Owner', 'Recruiter', 'Hiring Manager', 'Admin', 'JobApplicant'];
  const applicationName = 'RecruiteePro v6';
  const tenantName = 'Business Organization';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const userStories = `1. Business Owner:
   a. As a business owner, I want to be able to create and manage my organization's account on the platform, so that I can oversee the hiring process.
   b. As a business owner, I want to be able to assign roles (recruiter, hiring manager, admin) to my team members, so that they can perform their respective tasks in the hiring process.
   c. As a business owner, I want to have access to analytics and reports on the hiring process, so that I can make informed decisions and improve the process.
   d. As a business owner, I want to be able to set up custom workflows for different job positions, so that the hiring process can be tailored to the specific needs of each role.
   e. As a business owner, I want to be able to integrate the platform with other tools (e.g., HR software, job boards), so that the hiring process can be streamlined and efficient.

2. Recruiter:
   a. As a recruiter, I want to be able to post job openings on the platform, so that job applicants can apply for the positions.
   b. As a recruiter, I want to be able to review and manage the resumes and applications received, so that I can shortlist the most suitable candidates.
   c. As a recruiter, I want to be able to schedule interviews with shortlisted candidates, so that the hiring manager can evaluate them.
   d. As a recruiter, I want to be able to communicate with job applicants through the platform, so that I can provide updates and feedback on their application status.
   e. As a recruiter, I want to be able to collaborate with the hiring manager and admin on the platform, so that we can work together efficiently in the hiring process.

3. Hiring Manager:
   a. As a hiring manager, I want to be able to review the shortlisted candidates' profiles and resumes, so that I can evaluate their suitability for the job.
   b. As a hiring manager, I want to be able to conduct interviews with the candidates, either in-person or through the platform's video conferencing feature, so that I can assess their skills and fit for the role.
   c. As a hiring manager, I want to be able to provide feedback on the candidates to the recruiter and admin, so that we can make a collective decision on the best candidate for the job.
   d. As a hiring manager, I want to be able to collaborate with the recruiter and admin on the platform, so that we can work together efficiently in the hiring process.

4. Admin:
   a. As an admin, I want to be able to manage user accounts and permissions within the organization, so that the right people have access to the platform and its features.
   b. As an admin, I want to be able to configure the platform's settings and integrations, so that it works seamlessly with our existing tools and processes.
   c. As an admin, I want to be able to assist the recruiter and hiring manager in the hiring process, by providing support and managing the platform's features as needed.

5. Job Applicant:
   a. As a job applicant, I want to be able to search and apply for job openings on the platform, so that I can find a suitable position.
   b. As a job applicant, I want to be able to create and manage my profile on the platform, so that I can showcase my skills and experience to potential employers.
   c. As a job applicant, I want to be able to track the status of my applications and receive updates from the recruiter, so that I can stay informed about my chances of getting hired.
   d. As a job applicant, I want to be able to communicate with the recruiter through the platform, so that I can ask questions and receive feedback on my application.`;

  const { session } = useSession();
  if (!process.env.NEXT_PUBLIC_SHOW_BRIEFING || process.env.NEXT_PUBLIC_SHOW_BRIEFING === 'false') {
    return null;
  }
  return (
    <Box width={1} position="fixed" left="20px" bottom="20px" zIndex={3}>
      <Popover placement="top">
        <PopoverTrigger>
          <IconButton
            aria-label="Help Info"
            icon={<FiInfo />}
            bg="blue.800"
            color="white"
            _hover={{ bg: 'blue.800' }}
            _active={{ bg: 'blue.800' }}
            _focus={{ bg: 'blue.800' }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>App Briefing</PopoverHeader>
          <PopoverBody maxH="400px" overflowY="auto">
            <Text mb="2">Hi there!</Text>
            <Text mb="2">
              Welcome to {applicationName}, your freshly generated B2B SaaS application. This in-app briefing will guide
              you through your application. Feel free to remove this tutorial with the{' '}
              <Box as="span" bg="yellow.300" p={1}>
                NEXT_PUBLIC_SHOW_BRIEFING
              </Box>{' '}
              environment variable.
            </Text>
            <Text mb="2">You can use {applicationName} with one of these roles:</Text>
            <UnorderedList mb="2">
              {roles.map((role) => (
                <ListItem key={role}>{role}</ListItem>
              ))}
            </UnorderedList>
            {session?.roqUserId ? (
              <Text mb="2">You are currently logged in as a {session?.user?.roles?.join(', ')}.</Text>
            ) : (
              <Text mb="2">
                Right now, you are not logged in. The best way to start your journey is by signing up as{' '}
                {ownerRoles.join(', ')} and to create your first {tenantName}.
              </Text>
            )}
            <Text mb="2">
              {applicationName} was generated based on these user stories. Feel free to try them out yourself!
            </Text>
            <Box mb="2" whiteSpace="pre-wrap">
              {userStories}
            </Box>
            <Text mb="2">
              If you are happy with the results, then you can get the entire source code here:{' '}
              <Link href={githubUrl} color="cyan.500" isExternal>
                {githubUrl}
              </Link>
            </Text>
            <Text mb="2">
              Console Dashboard: For configuration and customization options, access our console dashboard. Your project
              has already been created and is waiting for your input. Check your emails for the invite.
            </Text>
            <Text mb="2">
              <Link href="https://console.roq.tech" color="cyan.500" isExternal>
                ROQ Console
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
