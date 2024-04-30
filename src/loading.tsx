import "@/assets/loading.css";

const Loding = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center",height:'80vh',width:'100%' }}>
      <div className="three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </div>
  );
};
export default Loding;
