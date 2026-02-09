import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import stars from "../../assets/images/ui/aistars.svg";
import Recommended from "../../assets/images/ui/Recommended.jpg";
import cart from "../../assets/images/ui/CartIcon.svg";
import tryicon from "../../assets/images/ui/ic_try_on_now_Wt.svg";
import { aiStylistService } from "../../api/services/aiStylistService";

const AIStylingQuiz = () => {
  const navigate = useNavigate();
  
  // Quiz state
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // For Section 5 questions
  const [answers, setAnswers] = useState({
    section1: null, // Style direction: A, B, or C
    section2: null, // Structure & feel: A, B, or C
    section3: null, // Body emphasis: A, B, C, or D
    section4: [], // Lifestyle context: array of selected options
    section5: {
      question5: null, // What are you shopping for: A, B, C, or D
      question6: null, // Type of occasion: A, B, C, or D
      question7: null, // Minimal or statement: A or B
      question8: [], // Keep in mind: array of selected options
      question8Notes: null, // Additional notes: optional text
    },
  });

  // Results state
  const [outfits, setOutfits] = useState([]);
  const [recoLoading, setRecoLoading] = useState(false);
  const [recoError, setRecoError] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [explanation, setExplanation] = useState(null);

  // Section 4 multi-select state
  const [section4Selections, setSection4Selections] = useState({
    work: false,
    everyday: false,
    evening: false,
    event: false,
  });

  // Section 5 additional notes state
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Section 5 question 8 multi-select state
  const [question8Selections, setQuestion8Selections] = useState({
    comfort: false,
    layering: false,
    minimal: false,
  });

  const sections = [
    {
      title: "SECTION 1: STYLE DIRECTION",
      question: "Which style direction do you naturally lean toward?",
      options: [
        { id: "A", label: "Clean, minimal, refined" },
        { id: "B", label: "Sculptural, expressive, statement" },
        { id: "C", label: "A mix of both" },
      ],
    },
    {
      title: "SECTION 2: STRUCTURE & FEEL",
      question: "How do you want your clothes to feel on your body?",
      options: [
        { id: "A", label: "Soft and comfortable" },
        { id: "B", label: "Polished and structured" },
        { id: "C", label: "Sculpted and defined" },
      ],
    },
    {
      title: "SECTION 3: BODY EMPHASIS",
      question: "Is there an area you usually like to highlight?",
      options: [
        { id: "A", label: "Waist" },
        { id: "B", label: "Legs" },
        { id: "C", label: "Shoulders" },
        { id: "D", label: "Balanced / no preference" },
      ],
    },
    {
      title: "SECTION 4: LIFESTYLE CONTEXT",
      question: "Which moments do you dress for most? (Select all that apply)",
      isMultiSelect: true,
      options: [
        { id: "work", label: "Work / meetings" },
        { id: "everyday", label: "Everyday / casual" },
        { id: "evening", label: "Evening / dinners" },
        { id: "event", label: "Events / occasions" },
      ],
    },
    {
      title: "SECTION 5: OCCASION BASED QUESTIONS",
      questions: [
        {
          id: "question5",
          question: "What are you shopping for right now?",
          options: [
            { id: "A", label: "Top" },
            { id: "B", label: "Bottom" },
            { id: "C", label: "A dress or set" },
            { id: "D", label: "A full look" },
          ],
        },
        {
          id: "question6",
          question: "What type of occasion is this for?",
          options: [
            { id: "A", label: "Work" },
            { id: "B", label: "Everyday" },
            { id: "C", label: "Evening / dinner" },
            { id: "D", label: "Event" },
          ],
        },
        {
          id: "question7",
          question: "Do you want this to feel minimal or more of a statement?",
          options: [
            { id: "A", label: "Minimal & refined" },
            { id: "B", label: "Sculptural & statement" },
          ],
        },
        {
          id: "question8",
          question: "Anything we should keep in mind?",
          isMultiSelect: true,
          isTextInput: true,
          options: [
            { id: "comfort", label: "Comfort first" },
            { id: "layering", label: "Layering friendly (AC)" },
            { id: "minimal", label: "Minimal effort" },
          ],
          placeholder: "Additional notes (optional)",
        },
      ],
    },
  ];

  const totalSections = sections.length;
  const currentSectionData = sections[currentSection];

  // Handle single select answer
  const handleSingleSelect = (optionId) => {
    if (currentSection === 0) {
      setAnswers({ ...answers, section1: optionId });
    } else if (currentSection === 1) {
      setAnswers({ ...answers, section2: optionId });
    } else if (currentSection === 2) {
      setAnswers({ ...answers, section3: optionId });
    } else if (currentSection === 4) {
      // Section 5 questions
      if (currentQuestionIndex < currentSectionData.questions.length) {
        const questionId = currentSectionData.questions[currentQuestionIndex].id;
        setAnswers({
          ...answers,
          section5: {
            ...answers.section5,
            [questionId]: optionId,
          },
        });
      }
    }
  };

  // Handle multi-select for Section 4
  const handleMultiSelect = (optionId) => {
    setSection4Selections({
      ...section4Selections,
      [optionId]: !section4Selections[optionId],
    });
  };

  // Handle multi-select for Section 5 question 8
  const handleQuestion8MultiSelect = (optionId) => {
    setQuestion8Selections({
      ...question8Selections,
      [optionId]: !question8Selections[optionId],
    });
  };

  // Reset question index when entering Section 5
  useEffect(() => {
    if (currentSection === 4) {
      // Find first unanswered question
      let firstUnanswered = 0;
      for (let i = 0; i < sections[4].questions.length; i++) {
        const questionId = sections[4].questions[i].id;
        if (sections[4].questions[i].isMultiSelect && sections[4].questions[i].isTextInput) {
          // Question 8 - both multi-select and text input, both optional
          // Always show it if we reach it
          firstUnanswered = i;
          break;
        } else if (sections[4].questions[i].isTextInput) {
          if (!additionalNotes) {
            firstUnanswered = i;
            break;
          }
        } else {
          if (!answers.section5[questionId]) {
            firstUnanswered = i;
            break;
          }
        }
      }
      setCurrentQuestionIndex(firstUnanswered);
    }
  }, [currentSection]);

  // Restore question 8 selections when displaying it
  useEffect(() => {
    if (currentSection === 4 && currentQuestionIndex === 3) {
      // Question 8 is at index 3
      const savedSelections = answers.section5.question8 || [];
      const savedNotes = answers.section5.question8Notes || "";
      
      // Restore checkbox selections
      const restoredSelections = {
        comfort: savedSelections.includes("comfort"),
        layering: savedSelections.includes("layering"),
        minimal: savedSelections.includes("minimal"),
      };
      setQuestion8Selections(restoredSelections);
      
      // Restore text input
      setAdditionalNotes(savedNotes);
    }
  }, [currentSection, currentQuestionIndex, answers.section5]);

  // Check if current section/question is complete
  const canProceed = () => {
    if (currentSection === 0) return answers.section1 !== null;
    if (currentSection === 1) return answers.section2 !== null;
    if (currentSection === 2) return answers.section3 !== null;
    if (currentSection === 3) {
      // Section 4 - at least one selection required
      return Object.values(section4Selections).some((val) => val);
    }
    if (currentSection === 4) {
      const currentQuestion = currentSectionData.questions[currentQuestionIndex];
      if (!currentQuestion) return true; // All questions answered
      if (currentQuestion.isMultiSelect && currentQuestion.isTextInput) {
        // Question 8 - both are optional
        return true;
      }
      if (currentQuestion.isTextInput) {
        return true; // Text input is optional
      }
      return answers.section5[currentQuestion.id] !== null;
    }
    return false;
  };

  // Check if we're on the last section
  const isLastSection = () => {
    if (currentSection === 4) {
      return currentQuestionIndex >= currentSectionData.questions.length - 1;
    }
    return currentSection === totalSections - 1;
  };

  // Handle next button
  const handleNext = () => {
    if (!canProceed()) return;

    // Save Section 4 answers
    if (currentSection === 3) {
      const selectedOptions = Object.entries(section4Selections)
        .filter(([_, selected]) => selected)
        .map(([key, _]) => key);
      setAnswers({ ...answers, section4: selectedOptions });
      setCurrentSection(4);
      return;
    }

    // Handle Section 5 navigation
    if (currentSection === 4) {
      const currentQuestion = currentSectionData.questions[currentQuestionIndex];
      
      // Save question 8 answers (both multi-select and text input)
      if (currentQuestion?.id === "question8") {
        const selectedOptions = Object.entries(question8Selections)
          .filter(([_, selected]) => selected)
          .map(([key, _]) => key);
        
        setAnswers({
          ...answers,
          section5: {
            ...answers.section5,
            question8: selectedOptions,
            question8Notes: additionalNotes || null,
          },
        });
      } else if (currentQuestion?.isTextInput && additionalNotes) {
        // Other text input questions (if any)
        setAnswers({
      ...answers,
          section5: {
            ...answers.section5,
            [currentQuestion.id]: additionalNotes,
          },
        });
      }

      // Move to next question in Section 5
      if (currentQuestionIndex < currentSectionData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
        return;
      }

      // All Section 5 questions answered, submit quiz
      handleSubmitQuiz();
      return;
    }

    // Move to next section for Sections 1-3
    setCurrentSection(currentSection + 1);
  };

  // Handle previous button
  const handlePrevious = () => {
    if (currentSection === 4) {
    if (currentQuestionIndex > 0) {
        // Stay in Section 5, go to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
        return;
      } else {
        // Go back to Section 4
        setCurrentSection(3);
        return;
      }
    }
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Map answers to product recommendations
  const mapAnswersToProducts = () => {
    const recommendations = new Set();

    // Section 1: Style direction
    if (answers.section1 === "A") {
      recommendations.add("Essential Top");
      recommendations.add("Knit Sweater");
      recommendations.add("Trousers (closed)");
      recommendations.add("Skirt (alone)");
    } else if (answers.section1 === "B") {
      recommendations.add("Corset");
      recommendations.add("Dress Set (full)");
      recommendations.add("Blazer (asymmetric)");
      recommendations.add("Trousers (open)");
    } else if (answers.section1 === "C") {
      recommendations.add("Blazer");
      recommendations.add("Trousers (mode-based)");
    }

    // Section 2: Structure & feel
    if (answers.section2 === "A") {
      recommendations.add("Knit Sweater");
      recommendations.add("Essential Top");
      recommendations.add("Skirt");
    } else if (answers.section2 === "B") {
      recommendations.add("Blazer");
      recommendations.add("Trousers");
    } else if (answers.section2 === "C") {
      recommendations.add("Corset");
      recommendations.add("Dress Set");
    }

    // Section 3: Body emphasis
    if (answers.section3 === "A") {
      recommendations.add("Corset");
      recommendations.add("Dress Set");
      recommendations.add("Skirt");
    } else if (answers.section3 === "B") {
      recommendations.add("Zip-Hem Trousers");
    } else if (answers.section3 === "C") {
      recommendations.add("Tops");
      recommendations.add("Sweater");
    } else if (answers.section3 === "D") {
      recommendations.add("Blazer");
    }

    // Section 4: Lifestyle context
    if (answers.section4.includes("work")) {
      recommendations.add("Blazer");
      recommendations.add("Trousers (closed)");
      recommendations.add("Essential Top");
    }
    if (answers.section4.includes("everyday")) {
      recommendations.add("Sweater");
      recommendations.add("Skirt");
      recommendations.add("Essential Top");
    }
    if (answers.section4.includes("evening")) {
      recommendations.add("Corset");
      recommendations.add("Trousers (opened)");
      recommendations.add("Blazer");
    }
    if (answers.section4.includes("event")) {
      recommendations.add("Dress Set");
      recommendations.add("Blazer (asymmetric)");
      recommendations.add("Trousers (opened)");
    }

    // Section 5: Occasion-based
    if (answers.section5.question6 === "A") {
      // Work
      recommendations.add("Blazer");
      recommendations.add("Trousers (closed)");
      recommendations.add("Essential Top");
    } else if (answers.section5.question6 === "B") {
      // Everyday
      recommendations.add("Sweater");
      recommendations.add("Skirt");
      recommendations.add("Essential Top");
    } else if (answers.section5.question6 === "C") {
      // Evening
      recommendations.add("Corset");
      recommendations.add("Trousers (opened)");
      recommendations.add("Blazer");
    } else if (answers.section5.question6 === "D") {
      // Event
      recommendations.add("Dress Set");
      recommendations.add("Blazer (asymmetric)");
      recommendations.add("Trousers (opened)");
    }

    if (answers.section5.question7 === "A") {
      // Minimal
      recommendations.add("Essential Top");
      recommendations.add("Knit Sweater");
      recommendations.add("Trousers (closed)");
      recommendations.add("Skirt (alone)");
    } else if (answers.section5.question7 === "B") {
      // Statement
      recommendations.add("Corset");
      recommendations.add("Dress Set (full)");
      recommendations.add("Blazer (asymmetric)");
      recommendations.add("Trousers (open)");
    }

    return Array.from(recommendations);
  };

  // Submit quiz and get recommendations
  const handleSubmitQuiz = async () => {
    setRecoLoading(true);
    setRecoError(null);
    setQuizSubmitted(true);
    
    try {
      // Map answers to product recommendations
      const productRecommendations = mapAnswersToProducts();

      // Prepare payload for backend
      const submissionPayload = {
        answers: {
          section1: answers.section1,
          section2: answers.section2,
          section3: answers.section3,
          section4: answers.section4,
          section5: answers.section5,
        },
        recommendations: productRecommendations,
        notes: answers.section5.question8Notes || "",
        question8Selections: answers.section5.question8 || [],
      };

      // Submit quiz
      const submissionResponse = await aiStylistService.submitQuiz(submissionPayload);
      const submissionId = submissionResponse?.submission?.id;

      // Get recommendations
      const recommendationsPayload = submissionId
        ? { submission_id: submissionId }
        : { answers: submissionPayload.answers };

      const data = await aiStylistService.getRecommendations(recommendationsPayload);
      setOutfits(data?.outfits || []);
      setExplanation(data?.explanation || null);
    } catch (err) {
      setRecoError(
        err?.response?.data?.error || err?.message || "Failed to get recommendations"
      );
      setOutfits([]);
    } finally {
      setRecoLoading(false);
    }
  };

  // Render current section
  const renderCurrentSection = () => {
    if (currentSection === 4) {
      // Section 5 - multiple questions
      const currentQuestion = currentSectionData.questions[currentQuestionIndex];

      if (!currentQuestion) {
        return null; // All questions answered
      }

      // Question 8 - both multi-select and text input
      if (currentQuestion.isMultiSelect && currentQuestion.isTextInput) {
        return (
          <div>
            <h3 className="text-center m-6 font-normal lg:text-[20px] md:text-[18px] text-[16px] align-middle text-[#1A1A1A]">
              {currentQuestion.question}
            </h3>
            
            {/* Multi-select checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
              {currentQuestion.options.map((opt) => {
                const checked = question8Selections[opt.id];
                return (
                  <label
                    key={opt.id}
                    className="block cursor-pointer"
                    onClick={() => handleQuestion8MultiSelect(opt.id)}
                  >
                    <div
                      className={`rounded-[16px] p-6 border-2 transition ${
                        checked
                          ? "border-[#374151] bg-[#F5F1EB]"
                          : "border-[#E7E1DA] hover:border-[#DDAE8C]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-[#2d2d2d]">
                          {opt.label}
                        </span>
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#374151]"
                          checked={checked}
                          onChange={() => handleQuestion8MultiSelect(opt.id)}
                        />
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Text input */}
            <div className="max-w-2xl mx-auto">
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 border-2 border-[#E7E1DA] rounded-[16px] focus:border-[#374151] focus:outline-none resize-none"
                rows="4"
              />
            </div>
          </div>
        );
      }

      if (currentQuestion.isTextInput) {
        return (
          <div>
            <h3 className="text-center m-6 font-normal lg:text-[20px] md:text-[18px] text-[16px] align-middle text-[#1A1A1A]">
              {currentQuestion.question}
            </h3>
            <div className="max-w-2xl mx-auto">
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 border-2 border-[#E7E1DA] rounded-[16px] focus:border-[#374151] focus:outline-none resize-none"
                rows="4"
              />
            </div>
          </div>
        );
      }

      return (
        <div>
          <h3 className="text-center m-6 font-normal lg:text-[20px] md:text-[18px] text-[16px] align-middle text-[#1A1A1A]">
            {currentQuestion.question}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentQuestion.options.map((opt) => {
              const checked = answers.section5[currentQuestion.id] === opt.id;
              return (
                <label
                  key={opt.id}
                  className="block cursor-pointer"
                  onClick={() => handleSingleSelect(opt.id)}
                >
                  <div
                    className={`rounded-[16px] p-6 border-2 transition ${
                      checked
                        ? "border-[#374151] bg-[#F5F1EB]"
                        : "border-[#E7E1DA] hover:border-[#DDAE8C]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-[#2d2d2d]">
                        {opt.label}
                      </span>
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        className="w-4 h-4 accent-[#374151]"
                        checked={checked}
                        onChange={() => handleSingleSelect(opt.id)}
                      />
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    // Sections 1-4
    if (currentSection === 3) {
      // Section 4 - multi-select
      return (
        <div>
          <h3 className="text-center m-6 font-normal lg:text-[20px] md:text-[18px] text-[16px] align-middle text-[#1A1A1A]">
            {currentSectionData.question}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentSectionData.options.map((opt) => {
              const checked = section4Selections[opt.id];
              return (
                <label
                  key={opt.id}
                  className="block cursor-pointer"
                  onClick={() => handleMultiSelect(opt.id)}
                >
                  <div
                    className={`rounded-[16px] p-6 border-2 transition ${
                      checked
                        ? "border-[#374151] bg-[#F5F1EB]"
                        : "border-[#E7E1DA] hover:border-[#DDAE8C]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-[#2d2d2d]">
                        {opt.label}
                      </span>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#374151]"
                        checked={checked}
                        onChange={() => handleMultiSelect(opt.id)}
                      />
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    // Sections 1-3 - single select
    return (
      <div>
        <h3 className="text-center m-6 font-normal lg:text-[20px] md:text-[18px] text-[16px] align-middle text-[#1A1A1A]">
          {currentSectionData.question}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {currentSectionData.options.map((opt) => {
            let checked = false;
            if (currentSection === 0) checked = answers.section1 === opt.id;
            else if (currentSection === 1) checked = answers.section2 === opt.id;
            else if (currentSection === 2) checked = answers.section3 === opt.id;

            return (
              <label
                key={opt.id}
                className="block cursor-pointer"
                onClick={() => handleSingleSelect(opt.id)}
              >
                <div
                  className={`rounded-[16px] p-6 border-2 transition ${
                    checked
                      ? "border-[#374151] bg-[#F5F1EB]"
                      : "border-[#E7E1DA] hover:border-[#DDAE8C]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-[#2d2d2d]">
                      {opt.label}
                    </span>
                    <input
                      type="radio"
                      name={`section${currentSection + 1}`}
                      className="w-4 h-4 accent-[#374151]"
                      checked={checked}
                      onChange={() => handleSingleSelect(opt.id)}
                    />
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  };


  // Handle product card click
  const handleProductCardClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <>
      <section className="bg-[#FDFAF8] py-[60px] w-full">
        <div className="max-w-7xl mx-auto px-4">
          {/* Outer Quiz Card */}
          <div className="bg-white rounded-[12px] shadow-[0px_4px_20px_-4px_#1A1A1A14] p-10 md:p-14 mx-2">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-[28px] mb-2">
                <img src={stars} alt="" className="h-8 w-8 lg:h-10 lg:w-10" />
                <h2 className="font-normal text-[24px] sm:text-[40px] md:text-[50px] lg:text-[54px] tracking-normal text-[#374151]">
                  nAia AI Styling Quiz
                </h2>
                <img src={stars} alt="" className="h-8 w-8 lg:h-10 lg:w-10" />
              </div>

              {/* Underline */}
              <div className="w-[300px] sm:w-[350px] lg:w-[413px] h-1 mx-auto rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>

              {/* Sub text */}
              <p className="mt-6 font-normal lg:text-[20px] md:text-[18px] text-[16px] leading-[28px] tracking-0 text-center align-middle text-[#374151]">
                Discover your digital style blueprint.
              </p>

              <p className="font-normal lg:text-[18px] md:text-[16px] text-[14px] leading-[28px] tracking-normal text-center text-[#797979] mt-2 mx-auto">
                Every question helps our AI understand your aesthetic — so it can
                curate the perfect modular looks for you.
              </p>
            </div>

            {/* Section Title */}
            <h4 className="text-center mt-8 font-semibold lg:text-[18px] md:text-[16px] text-[14px] text-[#374151] uppercase tracking-wide">
              {currentSectionData.title}
            </h4>

            {/* Progress indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {Array.from({ length: totalSections }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-[64px] lg:h-[3px] h-[2px] rounded-full ${
                    idx <= currentSection ? "bg-[#2c3445]" : "bg-[#d6d6d6]"
                  }`}
                ></div>
              ))}
            </div>

            {/* Question Counter */}
            {currentSection === 4 && (
              <p className="text-center mt-4 text-sm text-[#797979]">
                Question {currentQuestionIndex + 1} of{" "}
                {currentSectionData.questions.length}
              </p>
            )}

            {/* Question Content */}
            {renderCurrentSection()}

            {/* Buttons */}
            <div className="mt-10 flex justify-center gap-6">
              <button
                className={`
                  px-10 py-3 rounded-full border border-[#374151] text-[#374151] 
                  bg-white hover:bg-[#f5f5f5] transition text-[16px]
                  ${currentSection === 0 && currentQuestionIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }
                `}
                onClick={handlePrevious}
                disabled={
                  (currentSection === 0 && currentQuestionIndex === 0) ||
                  recoLoading
                }
              >
                Previous
              </button>

              <button
                className="
                  px-12 py-3 rounded-full text-white font-semibold
                  bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] 
                  shadow-[0_10px_25px_rgba(0,0,0,0.20)]
                  hover:opacity-90 transition text-[16px] 
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                onClick={handleNext}
                disabled={!canProceed() || recoLoading}
              >
                {recoLoading
                  ? "Generating…"
                  : isLastSection()
                  ? "Get Recommendations"
                  : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      {quizSubmitted && (
        <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Heading */}
          <h2 className="font-normal text-[24px] sm:text-[40px] md:text-[50px] lg:text-[54px] tracking-normal text-[#374151]">
            Recommended for you
          </h2>

          {/* Underline */}
            <div className="w-[300px] sm:w-[350px] lg:w-[413px] h-1 mx-auto rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>

          {/* Subtitle */}
          <p className="mt-3 font-normal lg:text-[20px] md:text-[18px] text-[16px] tracking-0 text-center align-middle text-[#374151]">
            {recoLoading
              ? "Finding outfits for you…"
              : `${outfits.length} outfit${outfits.length === 1 ? "" : "s"} match your preferences`}
          </p>

          {/* Explanation Text */}
          {explanation && !recoLoading && (
            <div className="mt-6 max-w-3xl mx-auto">
              <p className="font-normal lg:text-[18px] md:text-[16px] text-[15px] leading-[28px] tracking-0 text-center text-[#595959] px-4">
                {explanation}
              </p>
            </div>
          )}

          {recoError ? (
            <p className="mt-3 text-center text-sm text-red-600">{recoError}</p>
          ) : null}

          {/* Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {outfits.map((o, idx) => {
              const products = o?.products || [];
              const img = products?.[0]?.primary_image || Recommended;
              const firstProductId = products?.[0]?.id;
              const total = products.reduce((sum, p) => {
                const v = Number(p?.price ?? 0);
                return sum + (Number.isFinite(v) ? v : 0);
              }, 0);
              const match =
                o?.match === null || o?.match === undefined
                  ? null
                  : `${Math.round(Number(o.match))}% Match`;

              return (
              <div
                key={`${o?.title || "outfit"}-${idx}`}
                onClick={() => handleProductCardClick(firstProductId)}
                    className="rounded-3xl overflow-hidden border border-[#eaeaea] shadow-[0px_4px_20px_-4px_#1A1A1A14] cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={img}
                    alt={o.title}
                    className="w-full h-[362px] object-cover"
                  />

                  {/* Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle wishlist toggle here if needed
                    }}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#374151"
                      strokeWidth={2}
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </button>

                  {/* Match Badge */}
                  {match && (
                        <div className="absolute bottom-3 left-3 text-[16px] font-semibold text-[#1A1A1A] px-3 py-1 rounded-full bg-gradient-to-r from-[#E6B999] to-[#ECD9C6]">
                      {match}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 text-left">
                  {/* Category */}
                      <p className="font-sans font-normal text-[10.7px] leading-[16px] tracking-[0.3px] uppercase text-[#595959] align-middle">
                    {o.category}
                  </p>

                  {/* Title */}
                  <h3 className="mt-1 font-sans font-semibold text-[17px] leading-[28px] text-[#1A1A1A] align-middle">
                    {o.title}
                  </h3>

                  {/* Price */}
                  <p className="mt-1 text-[20px] font-medium text-[#E6B999]">
                        {Number.isFinite(total) && total > 0
                          ? `AED ${total.toFixed(0)}`
                          : "AED —"}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(o?.tags || []).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-xs px-3 py-1 rounded-full bg-[#F5F1EB] text-[#1A1A1A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Virtual Try-On Button */}
                  <div className="flex items-center justify-between mt-5 gap-[16px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle virtual try-on
                      }}
                          className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-[#1f1f1f] via-[#2c2522] to-[#d3a57e] font-normal text-[16px] leading-[24px] align-bottom text-white flex items-center justify-between"
                    >
                      <img src={tryicon} alt="" /> Virtual Try-on!
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle add to cart
                      }}
                          className="w-[50px] h-[46px] p-[0.75px_12.75px] rounded-full border-[1px] border-[var(--Body-text)]"
                    >
                      <img src={cart} alt="" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
      )}
    </>
  );
};

export default AIStylingQuiz;
