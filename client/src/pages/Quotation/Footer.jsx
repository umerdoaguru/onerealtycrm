import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";

function Footer({ companyName }) {
  const [footerImage, setFooterImage] = useState("");
  const userName = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    const fetchImages = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.post(
          "http://localhost:9000/api/company-header-footer",
          {
            company_name: companyName,
          }
        );
=======
        const response = await axios.post('http://localhost:9000/api/company-header-footer', {
          company_name: companyName
        });
>>>>>>> 60b59349eb3700a5fdac63d4db21e49fcf757eb2

        if (response.status === 200) {
          const { footer_img } = response.data;
          setFooterImage(footer_img);
        } else {
          console.error(
            "Error fetching header and footer images:",
            response.statusText
          );
        }
      } catch (error) {
        console.error(
          "Error fetching header and footer images:",
          error.message
        );
      }
    };

    fetchImages();
  }, [companyName]);

  return (
    <Wrapper>
      <div>
        <img
          src={footerImage}
          className="h-40 w-40 object-cover print:w-[100%] print:h-auto px-3"
          alt="Footer"
        />
      </div>
    </Wrapper>
  );
}

export default Footer;
const Wrapper = styled.div`
  /* img{
  width: -webkit-fill-available;


} */
`;
