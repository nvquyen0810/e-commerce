import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.agreeToTerms) {
      setError("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      navigate("/authentication/sign-in");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox mb={3} textAlign="center">
            <MDTypography variant="h3" fontWeight="bold">
              Join us today
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Enter your email and password to register
            </MDTypography>
          </MDBox>
          {error && (
            <MDBox mb={2}>
              <MDAlert color="error">
                {error}
              </MDAlert>
            </MDBox>
          )}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox
                checked={formData.agreeToTerms}
                onChange={handleChange}
                name="agreeToTerms"
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                I agree the{" "}
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                >
                  Terms and Conditions
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton 
                variant="gradient" 
                color="info" 
                fullWidth 
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : "SIGN IN"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={RouterLink}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default SignUp;
