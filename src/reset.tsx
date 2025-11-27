import Button from "@mui/material/Button";

function Reset() {
  const handleReset = async () => {
    try {
    const response = await fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset", {
      method: "POST",
    });

    if (response.ok) {
      const text = await response.text();
      alert(`${text}`);
    } else {
      alert(`Reset failed: ${response.statusText}`);
    }
  } catch (error) {
    alert(`Error: ${error}`);
  }
};

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <Button variant="contained" color="secondary" onClick={handleReset}>
        Reset Database
      </Button>
    </div>
  );
}

export default Reset;