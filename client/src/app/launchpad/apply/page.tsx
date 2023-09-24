/**
 * Apply Component
 *
 * This React component represents an application form with multiple pages and navigation.
 * Users can navigate through different sections of the form, input data, and submit it.
 *
 * @component
 */

// Import necessary modules and components
"use client";
import React, { useState } from "react";
import Button from "@/common/Button";
import {
  SectionOneForm,
  SecondSectionForm,
} from "@/components/Forms/ProjectDetails";
import Onborading from "@/components/Forms/Onborading";
import GetStarted from "@/components/Forms/GetStarted";
import TeamInformationForm from "@/components/Forms/TeamInformation";
import ArtworkDetailsForm from "@/components/Forms/ArtworkDetails";
import Minting from "@/components/Forms/Minting";

import ConfirmSubmit from "@/components/Forms/ConfirmSubmit";
import Succes from "@/components/Forms/Succes";
import SalesPlanForm from "@/components/Forms/Minting";


import Social from "@/components/Forms/Social";
import { toast } from "react-toastify";
import Endpoints from "@/http/endpoints";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import {
  getProject,
  getSales,
  getArtworks,
  getTeam,
  getSocial
} from "@/reducers/userSlice";
import { useSelector } from "react-redux";  
const Apply: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const project = useSelector(getProject);
  const sales = useSelector(getSales);
  const team = useSelector(getTeam);
  const artworks = useSelector(getArtworks);
  const socials = useSelector(getSocial);

  // State variables
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [confirm, setConfirm] = useState<boolean>(false);

  /**
   * Function to navigate to the next page of the application form.
   * It increments the current page number.
   */
  const handleNextPage = () => {
    if (currentPage < 7) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    if (currentPage >= 7) {
      const requestBody = {
        ...project,
        ...team,
        ...sales,
        ...artworks,
        ...socials,
      };
      setLoading(true);
      axios
        .post(Endpoints.LAUNCHPAD_CREATE_PACKAGE, requestBody)
        .then((response) => {
          setLoading(false);
          let message = response?.data?.message;
          toast.success(message, { theme: "colored" });
          router.push("/marketplace", { scroll: false });
        })
        .catch((error) => {
          let message = error?.response?.data?.error;
          toast.error(message, { theme: "colored" });
          setLoading(false);
        });
    }
  };
  

  /**
   * Function to toggle the confirmation state.
   * It changes the confirmation state from true to false or vice versa.
   */
  const toggleConfirmation = () => {
    setConfirm(!confirm);
  };

  // Check if the current page is the last page of the form
  const isLastPage = currentPage === 7;

  /**
   * Function to render the current page of the application form based on the current page number.
   * It returns the appropriate form component for the current page.
   *
   * @returns {JSX.Element} - The JSX element representing the current page of the form.
   */
  

  const previewCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <Onborading nextPage={handleNextPage} />;
      case 2:
        return <GetStarted nextPage={handleNextPage} />;
      case 3:
        return <SectionOneForm />;
      case 4:
        return <SecondSectionForm />;
      case 5:
        return <TeamInformationForm />;
      case 6:
        return <ArtworkDetailsForm />;
      case 7:
        return <Social />;
      default: 
        return;
    }
  };
  return (
    <div className="flex flex-col justify-start h-screen mt-10 mb-10 text-white">
      <div className="w-[98%] ">{ previewCurrentPage()}</div>
      {currentPage > 2 && currentPage < 9 && (
        <div className="w-[98%] flex justify-end mt-5">
          {isLastPage ? (
            <Button
              handleClick={toggleConfirmation}
              className="bg-gradient-linear px-6 mb-5 py-3"
            >
              <p>Submit</p>
            </Button>
          ) : (
            <Button
              handleClick={handleNextPage}
              className="bg-gradient-linear px-6 mb-5 py-3"
            >
              <p> Proceed</p>
            </Button>
          )}
        </div>
      )}
      {confirm && (
        <ConfirmSubmit nextPage={handleNextPage} cancel={toggleConfirmation} />
      )}
    </div>
  );
};

export default Apply;
