const moved = [
  ["/Candidates","/for-candidates"],["/clients","/for-clients"],["/about-us","/about"],
  ["/compliance","/candidate-compliance"],["/send-cv","/register"]
];
const config = {
  devIndicators:false,
  async redirects(){return moved.map(([source,destination])=>({source,destination,permanent:true}))}
};
export default config;
