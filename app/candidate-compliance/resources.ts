const forms = "https://irp-cdn.multiscreensite.com/c1b34cb1/files/uploaded/";
const policies = "https://irp.cdn-website.com/c1b34cb1/files/uploaded/";

export const resources = [
  {
    id: "registration-forms",
    title: "Registration and identity",
    items: [
      { title: "Nursing and ODP application form", description: "The published application pack for nurses and operating department practitioners.", href: forms + "MSL%20Application%20form%20November%202018%20Nurse%26ODP.PDF" },
      { title: "Annual health questionnaire", description: "Occupational health information requested during registration.", href: forms + "Annual%20Health%20Questionnaire.pdf" },
      { title: "DBS acceptable ID documents", description: "Documents you can use as evidence of identity for a DBS check.", href: forms + "DBS%20ID%20Acceptable%20documents%20.pdf" },
      { title: "Degree disclaimer", description: "The published declaration relating to degree evidence.", href: forms + "Degree%20disclaimer.pdf" },
      { title: "Reference form", description: "The form for referees to complete.", href: forms + "Reference%20form.pdf" },
      { title: "Professional indemnity self-declaration", description: "Ask the compliance team for the current form.", href: null },
    ],
  },
  {
    id: "assignment-resources",
    title: "During assignments",
    items: [
      { title: "Candidate handbook", description: "Guidance for candidates registering and working with MSL.", href: forms + "Handbook.pdf" },
      { title: "Timesheet", description: "Record hours worked on your assignment.", href: forms + "Timesheet.pdf" },
    ],
  },
  {
    id: "company-policies",
    title: "Company policies and commitments",
    items: [
      { title: "Modern slavery and human trafficking policy", description: "MSL’s published policy on slavery and human trafficking.", href: policies + "Policy%2001%20-%20ANTI%20SLAVERY%20AND%20HUMAN%20TRAFFICKING.pdf" },
      { title: "Modern slavery statement", description: "MSL’s published modern slavery statement.", href: policies + "MSL%20Modern%20Slavery%20Statement.pdf" },
      { title: "Carbon reduction plan", description: "MSL’s published plan for reducing carbon emissions.", href: policies + "New_PDF_Doc.PDF" },
    ],
  },
];
