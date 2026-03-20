import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Circle,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@components/ui/accordion";
import { useNavigate } from "react-router";
import { CheckCircle, XCircle, Home, Info } from "lucide-react";
import useAuthStore from "@stores/auth.store";
import { ScoreService } from "@services/score.service";

interface ExamResult {
  score: number;
  total: number;
  questions: any[];
  answers: Record<number, string>;
  timeSpent: number;
  date: string;
}

const ResultPage = () => {
  const navigate = useNavigate();
  const { id: userId, role } = useAuthStore();
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem("ges100_last_result");
    if (savedResult) {
      const parsedResult = JSON.parse(savedResult);
      setResult(parsedResult);
      
      // Automatically record score if user is a student
      if (userId && role === 'student') {
        ScoreService.submitScore(userId, parsedResult.score, parsedResult.total)
          .catch(err => console.log("Score already recorded or error:", err));
      }
    } else {
      navigate("/dashboard");
    }
  }, [navigate, userId, role]);

  if (!result) return null;

  const percentage = (result.score / result.total) * 100;
  const isPassed = percentage >= 50;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 6, md: 12 }}>
      <Container maxW="container.md">
        <VStack gap={{ base: 6, md: 8 }} align="stretch">
          {/* Score Card */}
          <Box bg="white" p={{ base: 6, md: 12 }} rounded="3xl" shadow="lg" textAlign="center" borderTop="12px solid" borderColor={isPassed ? "green.400" : "red.400"}>
            <VStack gap={6}>
              <Circle size={{ base: "80px", md: "120px" }} bg={isPassed ? "green.50" : "red.50"} color={isPassed ? "green.500" : "red.500"}>
                <Icon as={isPassed ? CheckCircle : XCircle} size={{ base: "xl", md: "2xl" }} />
              </Circle>
              
              <VStack gap={2}>
                <Heading size={{ base: "xl", md: "2xl" }} color="brand.navy">
                  {isPassed ? "Congratulations!" : "Keep Practicing!"}
                </Heading>
                <Text fontSize={{ base: "md", md: "xl" }} color="gray.600">
                  You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong>
                </Text>
              </VStack>

              <HStack gap={{ base: 4, md: 8 }} w="full" justify="center" pt={4}>
                <VStack gap={1}>
                  <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>Percentage</Text>
                  <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={isPassed ? "green.600" : "red.600"}>{percentage}%</Text>
                </VStack>
                <VStack gap={1}>
                  <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>Time Spent</Text>
                  <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="brand.navy">{formatTime(result.timeSpent)}</Text>
                </VStack>
              </HStack>

              <Stack direction={{ base: "column", sm: "row" }} gap={4} pt={6} w={{ base: "full", sm: "auto" }}>
                <Button variant="outline" size="lg" w={{ base: "full", sm: "auto" }} onClick={() => navigate("/dashboard")} leftIcon={<Home />}>
                  Back Home
                </Button>
              </Stack>
            </VStack>
          </Box>

          {/* Review Answers */}
          <VStack align="stretch" gap={6}>
            <Heading size={{ base: "md", md: "lg" }} color="brand.navy" px={2}>Review Answers</Heading>
            
            <AccordionRoot collapsible defaultValue={["review-0"]} variant="subtle">
              {result.questions.map((q, idx) => {
                const userAnswer = result.answers[idx];
                const isCorrect = userAnswer === q.originalAnswerText;
                
                return (
                  <AccordionItem key={idx} value={`review-${idx}`} bg="white" mb={4} rounded="xl" border="1px solid" borderColor="gray.100" overflow="hidden">
                    <AccordionTrigger px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }}>
                      <HStack gap={{ base: 2, md: 4 }} w="full">
                        <Circle size={{ base: "28px", md: "32px" }} bg={isCorrect ? "green.100" : "red.100"} color={isCorrect ? "green.600" : "red.600"}>
                          <Icon as={isCorrect ? CheckCircle : XCircle} size={{ base: "xs", md: "sm" }} />
                        </Circle>
                        <Text fontWeight="medium" textAlign="left" flex={1} fontSize={{ base: "sm", md: "md" }}>
                          Question {idx + 1}
                        </Text>
                        {!isCorrect && <Text color="red.500" fontSize="2xs" fontWeight="bold">Incorrect</Text>}
                      </HStack>
                    </AccordionTrigger>
                    <AccordionContent px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                      <VStack align="start" gap={4} pt={2}>
                        <Text fontWeight="bold" color="gray.800" fontSize={{ base: "sm", md: "md" }}>{q.question}</Text>
                        
                        <Stack w="full" gap={2}>
                          {q.options.map((opt: string, i: number) => {
                            const isSelected = userAnswer === opt;
                            const isAnswer = q.originalAnswerText === opt;
                            
                            let borderColor = "gray.100";
                            let bgColor = "transparent";
                            if (isAnswer) {
                              borderColor = "green.400";
                              bgColor = "green.50";
                            } else if (isSelected && !isCorrect) {
                              borderColor = "red.400";
                              bgColor = "red.50";
                            }

                            return (
                              <HStack key={i} p={3} border="1px solid" borderColor={borderColor} bg={bgColor} rounded="md" gap={3}>
                                <Circle size="24px" bg={isAnswer ? "green.500" : isSelected ? "red.500" : "gray.200"} color="white" fontSize="xs" fontWeight="bold" flexShrink={0}>
                                  {String.fromCharCode(65 + i)}
                                </Circle>
                                <Text fontSize="xs">{opt}</Text>
                              </HStack>
                            );
                          })}
                        </Stack>

                        <Box p={{ base: 3, md: 4 }} bg="blue.50" rounded="lg" w="full" borderLeft="4px solid" borderColor="blue.400">
                          <HStack gap={2} mb={1}>
                            <Icon as={Info} size="xs" color="blue.600" />
                            <Text fontSize="xs" fontWeight="bold" color="blue.800">Explanation</Text>
                          </HStack>
                          <Text fontSize="xs" color="blue.700">{q.explanation}</Text>
                        </Box>
                      </VStack>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </AccordionRoot>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default ResultPage;
