import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Progress,
  Stack,
  Circle,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { GES100_QUESTIONS } from "@services/questions";
import { Button } from "@components/ui/button";
import { RadioGroup, Radio, RadioText } from "@components/ui/radio-group";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { useNavigate } from "react-router";
import { Clock, ChevronLeft, ChevronRight, Bookmark, AlertTriangle, LogOut, Grid } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const EXAM_TIME_LIMIT = 30 * 60; // 30 minutes in seconds
const QUESTIONS_COUNT = 50;

const ExamPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_LIMIT);
  const [isExamStarted, setIsExamStarted] = useState(false);

  // Initialize Exam
  useEffect(() => {
    const savedExam = localStorage.getItem("ges100_exam_state");
    if (savedExam) {
      const state = JSON.parse(savedExam);
      setQuestions(state.questions);
      setAnswers(state.answers);
      setMarkedForReview(new Set(state.markedForReview));
      setTimeLeft(state.timeLeft);
      setCurrentIdx(state.currentIdx);
      setIsExamStarted(true);
    } else {
      // Randomly select 50 questions
      const shuffled = [...GES100_QUESTIONS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, QUESTIONS_COUNT).map(q => {
        // Shuffle options for each question
        const optionsWithLabels = q.options.map((opt, i) => ({ text: opt, originalLabel: String.fromCharCode(65 + i) }));
        const shuffledOptions = optionsWithLabels.sort(() => 0.5 - Math.random());
        
        return {
          ...q,
          options: shuffledOptions.map(o => o.text),
          originalAnswerText: q.options[q.answer.charCodeAt(0) - 65]
        };
      });
      setQuestions(selected as any);
      setIsExamStarted(true);
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (isExamStarted && questions.length > 0) {
      localStorage.setItem("ges100_exam_state", JSON.stringify({
        questions,
        answers,
        markedForReview: Array.from(markedForReview),
        timeLeft,
        currentIdx
      }));
    }
  }, [questions, answers, markedForReview, timeLeft, currentIdx, isExamStarted]);

  const handleSubmit = useCallback(() => {
    // Calculate score
    let score = 0;
    questions.forEach((q: any, idx) => {
      const userAnswer = answers[idx];
      if (userAnswer === q.originalAnswerText) {
        score++;
      }
    });

    const result = {
      score,
      total: questions.length,
      questions,
      answers,
      timeSpent: EXAM_TIME_LIMIT - timeLeft,
      date: new Date().toISOString()
    };

    localStorage.setItem("ges100_last_result", JSON.stringify(result));
    localStorage.removeItem("ges100_exam_state");
    navigate("/result");
  }, [questions, answers, timeLeft, navigate]);

  // Timer logic
  useEffect(() => {
    if (!isExamStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, handleSubmit]);

  if (!isExamStarted || questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(currentIdx)) next.delete(currentIdx);
      else next.add(currentIdx);
      return next;
    });
  };

  const handleEndQuiz = () => {
    localStorage.removeItem("ges100_exam_state");
    navigate("/dashboard");
  };

  const unansweredCount = questions.length - Object.keys(answers).length;

  const getVisibleQuestions = () => {
    const totalVisible = 5;
    const half = Math.floor(totalVisible / 2);
    let start = currentIdx - half;
    let end = currentIdx + half;

    if (start < 0) {
      start = 0;
      end = Math.min(questions.length - 1, totalVisible - 1);
    } else if (end >= questions.length) {
      end = questions.length - 1;
      start = Math.max(0, questions.length - totalVisible);
    }

    const visible = [];
    for (let i = start; i <= end; i++) {
      visible.push(i);
    }
    return visible;
  };

  const visibleQuestions = getVisibleQuestions();

  return (
    <Box minH="100vh" bg="gray.50" pb={24}>
      {/* Top Bar */}
      <Box bg="white" py={{ base: 2, md: 4 }} shadow="sm" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.lg">
          <VStack gap={{ base: 2, md: 4 }}>
            <HStack justify="space-between" w="full">
              <VStack align="start" gap={0}>
                <Heading size={{ base: "xs", md: "md" }} color="brand.navy">
                  Q{currentIdx + 1} of {questions.length}
                </Heading>
                {markedForReview.has(currentIdx) && (
                  <HStack color="orange.500" fontSize="2xs" fontWeight="bold">
                    <Icon as={Bookmark} fill="currentColor" boxSize="10px" />
                    <Text>Marked</Text>
                  </HStack>
                )}
              </VStack>
              <HStack gap={{ base: 3, md: 6 }}>
                <HStack color={timeLeft < 300 ? "red.500" : "brand.navy"} gap={1}>
                  <Icon as={Clock} boxSize={{ base: "14px", md: "20px" }} />
                  <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>{formatTime(timeLeft)}</Text>
                </HStack>
                
                <DialogRoot placement="center" motionPreset="slide-in-bottom">
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      color="red.500"
                      size="xs"
                      px={2}
                      _hover={{ bg: "red.50" }}
                      leftIcon={<LogOut size="14px" />}
                    >
                      <Text display={{ base: "none", sm: "block" }}>End Quiz</Text>
                      <Text display={{ base: "block", sm: "none" }}>End</Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle color="red.600">End Quiz?</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <VStack align="start" gap={4}>
                        <Text>Are you sure you want to end the quiz? Your progress will be lost and you will be returned to the dashboard.</Text>
                        <Text color="gray.500" fontSize="sm italic">Note: This will not submit your current answers for grading.</Text>
                      </VStack>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button variant="outline">Continue Quiz</Button>
                      </DialogActionTrigger>
                      <Button bg="red.500" color="white" onClick={handleEndQuiz} _hover={{ bg: "red.600" }}>
                        Yes, End Quiz
                      </Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
              </HStack>
            </HStack>
            <Progress.Root value={progress} colorPalette="orange" w="full" shape="rounded">
              <Progress.Track bg="gray.100">
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.md" py={{ base: 4, md: 8 }}>
        <VStack gap={{ base: 4, md: 8 }} align="stretch">
          {/* Question Card */}
          <Box bg="white" p={{ base: 5, md: 8 }} rounded="2xl" shadow="md">
            <VStack align="start" gap={{ base: 4, md: 6 }}>
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="medium" color="gray.800">
                {currentQuestion.question}
              </Text>

              <RadioGroup
                value={answers[currentIdx] || ""}
                onValueChange={(details) => setAnswers(prev => ({ ...prev, [currentIdx]: details.value ?? "" }))}
                w="full"
              >
                <Stack gap={{ base: 2, md: 4 }} w="full">
                  {currentQuestion.options.map((option, i) => (
                    <Box
                      key={i}
                      p={{ base: 3, md: 4 }}
                      border="2px solid"
                      borderColor={answers[currentIdx] === option ? "brand.orange" : "gray.100"}
                      rounded="xl"
                      cursor="pointer"
                      bg={answers[currentIdx] === option ? "orange.50" : "transparent"}
                      _hover={{ borderColor: "brand.orange" }}
                      transition="all 0.2s"
                      onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: option }))}
                    >
                      <HStack gap={{ base: 2, md: 4 }}>
                        <Radio value={option}>
                          <HStack gap={{ base: 2, md: 4 }}>
                            <Circle
                              size={{ base: "28px", md: "32px" }}
                              bg={answers[currentIdx] === option ? "brand.orange" : "gray.200"}
                              color={answers[currentIdx] === option ? "white" : "gray.600"}
                              fontWeight="bold"
                              fontSize="xs"
                            >
                              {String.fromCharCode(65 + i)}
                            </Circle>
                            <RadioText fontWeight="medium" color="gray.700" fontSize={{ base: "sm", md: "md" }}>{option}</RadioText>
                          </HStack>
                        </Radio>
                      </HStack>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </VStack>
          </Box>

          {/* Navigation */}
          <Stack direction={{ base: "column", sm: "row" }} justify="space-between" gap={4}>
            <Button
              variant="outline"
              size={{ base: "md", md: "lg" }}
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              leftIcon={<ChevronLeft size="20px" />}
            >
              Previous
            </Button>
            
            <HStack gap={{ base: 2, md: 4 }} w={{ base: "full", sm: "auto" }}>
              <Button
                variant="ghost"
                color="orange.500"
                size={{ base: "sm", md: "md" }}
                flex={1}
                onClick={toggleMarkForReview}
                leftIcon={<Bookmark size="18px" />}
              >
                {markedForReview.has(currentIdx) ? "Unmark" : "Mark"}
              </Button>

              {currentIdx === questions.length - 1 ? (
                <DialogRoot placement="center" motionPreset="slide-in-bottom">
                  <DialogTrigger asChild>
                    <Button
                      bg="brand.orange"
                      color="white"
                      size={{ base: "md", md: "lg" }}
                      px={{ base: 4, md: 8 }}
                      flex={2}
                      _hover={{ bg: "brand.orange/90" }}
                    >
                      Submit Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle color="brand.navy">
                        {unansweredCount > 0 ? "Incomplete Exam" : "Finish Exam"}
                      </DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <VStack align="start" gap={4}>
                        {unansweredCount > 0 ? (
                          <HStack gap={3} color="orange.600">
                            <Icon as={AlertTriangle} />
                            <Text fontWeight="medium">
                              You have <strong>{unansweredCount}</strong> unanswered questions.
                            </Text>
                          </HStack>
                        ) : (
                          <Text>Are you sure you want to submit your exam? You've answered all questions.</Text>
                        )}
                        <Text color="gray.600">Once submitted, you cannot change your answers.</Text>
                      </VStack>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button variant="outline">Review Answers</Button>
                      </DialogActionTrigger>
                      <Button bg="brand.orange" color="white" onClick={handleSubmit}>
                        Submit Now
                      </Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
              ) : (
                <Button
                  bg="brand.navy"
                  color="white"
                  size={{ base: "md", md: "lg" }}
                  px={{ base: 4, md: 8 }}
                  flex={2}
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  rightIcon={<ChevronRight size="20px" />}
                  _hover={{ bg: "brand.navy/90" }}
                >
                  Next
                </Button>
              )}
            </HStack>
          </Stack>
        </VStack>
      </Container>

      {/* Question Navigation Bar */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        py={3}
        px={4}
        shadow="0 -4px 20px rgba(0,0,0,0.05)"
        zIndex={10}
      >
        <Container maxW="container.lg">
          <HStack justify="space-between" gap={4}>
            {/* Legend - Hidden on mobile */}
            <HStack gap={4} display={{ base: "none", md: "flex" }}>
              <HStack gap={1}><Circle size="10px" bg="green.400" /><Text fontSize="xs">Answered</Text></HStack>
              <HStack gap={1}><Circle size="10px" bg="orange.400" /><Text fontSize="xs">Marked</Text></HStack>
              <HStack gap={1}><Circle size="10px" bg="gray.100" /><Text fontSize="xs">Remaining</Text></HStack>
            </HStack>

            <HStack gap={2} flex={1} justify="center">
              {visibleQuestions[0] > 0 && (
                <>
                  <Circle
                    size="36px"
                    bg="gray.50"
                    color="gray.600"
                    fontSize="xs"
                    fontWeight="bold"
                    cursor="pointer"
                    onClick={() => setCurrentIdx(0)}
                  >
                    1
                  </Circle>
                  <Text color="gray.400">...</Text>
                </>
              )}

              {visibleQuestions.map((i) => (
                <Circle
                  key={i}
                  size="40px"
                  bg={
                    currentIdx === i
                      ? "brand.navy"
                      : markedForReview.has(i)
                      ? "orange.400"
                      : answers[i]
                      ? "green.400"
                      : "gray.100"
                  }
                  color={currentIdx === i || markedForReview.has(i) || answers[i] ? "white" : "gray.600"}
                  fontSize="sm"
                  fontWeight="bold"
                  cursor="pointer"
                  onClick={() => setCurrentIdx(i)}
                  transition="all 0.2s"
                  _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                  border={currentIdx === i ? "2px solid" : "none"}
                  borderColor="brand.orange"
                >
                  {i + 1}
                </Circle>
              ))}

              {visibleQuestions[visibleQuestions.length - 1] < questions.length - 1 && (
                <>
                  <Text color="gray.400">...</Text>
                  <Circle
                    size="36px"
                    bg="gray.50"
                    color="gray.600"
                    fontSize="xs"
                    fontWeight="bold"
                    cursor="pointer"
                    onClick={() => setCurrentIdx(questions.length - 1)}
                  >
                    {questions.length}
                  </Circle>
                </>
              )}
            </HStack>

            <DialogRoot placement="center" motionPreset="slide-in-bottom">
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" leftIcon={<Grid size="16px" />}>
                  View All
                </Button>
              </DialogTrigger>
              <DialogContent maxW="container.md">
                <DialogHeader>
                  <DialogTitle color="brand.navy">Question Grid</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <VStack gap={6}>
                    <HStack gap={4} w="full" justify="center" p={2} bg="gray.50" rounded="lg">
                      <HStack gap={1}><Circle size="10px" bg="green.400" /><Text fontSize="xs">Answered</Text></HStack>
                      <HStack gap={1}><Circle size="10px" bg="orange.400" /><Text fontSize="xs">Marked</Text></HStack>
                      <HStack gap={1}><Circle size="10px" bg="brand.navy" /><Text fontSize="xs">Current</Text></HStack>
                    </HStack>
                    
                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(40px, 1fr))" gap={3} w="full">
                      {questions.map((_, i) => (
                        <DialogActionTrigger asChild key={i}>
                          <Circle
                            size="40px"
                            bg={
                              currentIdx === i
                                ? "brand.navy"
                                : markedForReview.has(i)
                                ? "orange.400"
                                : answers[i]
                                ? "green.400"
                                : "gray.50"
                            }
                            color={currentIdx === i || markedForReview.has(i) || answers[i] ? "white" : "gray.600"}
                            fontSize="sm"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setCurrentIdx(i)}
                            transition="all 0.2s"
                            _hover={{ transform: "scale(1.1)", shadow: "sm" }}
                          >
                            {i + 1}
                          </Circle>
                        </DialogActionTrigger>
                      ))}
                    </Box>
                  </VStack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="ghost">Close</Button>
                  </DialogActionTrigger>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default ExamPage;

