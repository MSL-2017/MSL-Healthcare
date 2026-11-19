export const groups = [
  { title: 'For candidates', links: [['Candidate services','/for-candidates'],['Healthcare jobs','/healthcare-jobs'],['Register / send CV','/register'],['Candidate compliance','/candidate-compliance']] },
  { title: 'For clients', links: [['Client services','/for-clients'],['Staffing solutions','/staffing-solutions'],['Healthcare specialisms','/healthcare-specialisms'],['Request staff','/request-staff']] },
  { title: 'Company', links: [['About MSL','/about'],['Work for MSL','/work-for-msl'],['Contact','/contact']] }
];
export const legal = [['Privacy policy','/privacy-policy'],['Cookie policy','/cookie-policy'],['Terms of use','/terms-of-use']];
export const paths = ['/', ...groups.flatMap(group => group.links.map(([,path])=>path)), ...legal.map(([,path])=>path)];
export const origin = process.env.SITE_URL || 'https://www.mslhealthcare.co.uk';
