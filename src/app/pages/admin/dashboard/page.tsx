import {
  Box,
  Container,
  Heading,
  Table,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Input,
  InputGroup,
  Circle,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { ScoreService, StudentResult } from "@services/score.service";
import { Users, Search, Award, Calendar, LogOut, RefreshCw, Download } from "lucide-react";
import { Button } from "@components/ui/button";
import useAuthStore from "@stores/auth.store";
import { useNavigate } from "react-router";

const AdminDashboard = () => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { clearAuth, fullName } = useAuthStore();
  const navigate = useNavigate();

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ScoreService.getAdminResults();
      setResults(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login");
  };

  const exportToCSV = () => {
    const headers = ["Student Name", "Email", "Score", "Total", "Percentage", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...results.map(r => [
        `"${r.fullName}"`,
        `"${r.email}"`,
        r.score ?? "N/A",
        r.total ?? "N/A",
        r.score ? `${Math.round((r.score / r.total!) * 100)}%` : "N/A",
        r.score !== null ? "Completed" : "Pending",
        r.date ? new Date(r.date).toLocaleString() : "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `GES100_Results_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = results.filter(r => 
    r.fullName.toLowerCase().includes(search.toLowerCase()) || 
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="brand.navy" color="white" py={4} shadow="md">
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <HStack gap={4}>
              <Circle size="40px" bg="white" color="brand.navy">
                <Icon as={Users} />
              </Circle>
              <VStack align="start" gap={0}>
                <Heading size="md">Admin Dashboard</Heading>
                <Text fontSize="xs" opacity={0.8}>GES 100 Results Management</Text>
              </VStack>
            </HStack>
            <HStack gap={4}>
              <VStack align="end" gap={0} display={{ base: "none", md: "flex" }}>
                <Text fontSize="sm" fontWeight="medium">Welcome, {fullName}</Text>
                <Text fontSize="2xs" opacity={0.7}>Last updated: {lastUpdated.toLocaleTimeString()}</Text>
              </VStack>
              <Button variant="ghost" color="white" size="sm" onClick={handleLogout} _hover={{ bg: "white/10" }}>
                <Icon as={LogOut} mr={2} size="sm" /> Logout
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Stats Bar */}
          <Stack direction={{ base: "column", md: "row" }} gap={4}>
            <Box bg="white" p={6} rounded="xl" shadow="sm" flex={1} borderLeft="4px solid" borderColor="brand.orange">
              <VStack align="start" gap={1}>
                <Text color="gray.500" fontSize="sm">Total Students</Text>
                <Text fontSize="2xl" fontWeight="bold">{results.length}</Text>
              </VStack>
            </Box>
            <Box bg="white" p={6} rounded="xl" shadow="sm" flex={1} borderLeft="4px solid" borderColor="green.400">
              <VStack align="start" gap={1}>
                <Text color="gray.500" fontSize="sm">Exams Completed</Text>
                <Text fontSize="2xl" fontWeight="bold">{results.filter(r => r.score !== null).length}</Text>
              </VStack>
            </Box>
            <Box bg="white" p={6} rounded="xl" shadow="sm" flex={1} borderLeft="4px solid" borderColor="blue.400">
              <VStack align="start" gap={1}>
                <Text color="gray.500" fontSize="sm">Average Score</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {results.filter(r => r.score !== null).length > 0
                    ? Math.round(results.reduce((acc, curr) => acc + (curr.score || 0), 0) / results.filter(r => r.score !== null).length)
                    : 0}
                </Text>
              </VStack>
            </Box>
          </Stack>

          {/* Table Controls */}
          <Box bg="white" p={4} rounded="xl" shadow="sm">
            <Stack direction={{ base: "column", md: "row" }} gap={4}>
              <InputGroup flex={1} bg="gray.50" rounded="md">
                <Input 
                  placeholder="Search students by name or email..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  border="none"
                  _focus={{ ring: 0 }}
                />
              </InputGroup>
              <HStack gap={2}>
                <Button 
                  variant="outline" 
                  size="md" 
                  onClick={fetchResults} 
                  loading={isLoading}
                  leftIcon={<RefreshCw size="16px" />}
                >
                  Refresh
                </Button>
                <Button 
                  bg="brand.navy" 
                  color="white" 
                  size="md" 
                  onClick={exportToCSV}
                  leftIcon={<Download size="16px" />}
                  _hover={{ bg: "brand.navy/90" }}
                >
                  Export CSV
                </Button>
              </HStack>
            </Stack>
          </Box>

          {/* Results Table */}
          <Box bg="white" rounded="xl" shadow="sm" overflow="hidden">
            {isLoading && results.length === 0 ? (
              <Box p={20} textAlign="center">
                <Spinner size="xl" color="brand.navy" mb={4} />
                <Text color="gray.500">Loading student results...</Text>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table.Root variant="line">
                  <Table.Header bg="gray.50">
                    <Table.Row>
                      <Table.ColumnHeader>Student Name</Table.ColumnHeader>
                      <Table.ColumnHeader>Email</Table.ColumnHeader>
                      <Table.ColumnHeader>Score</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Date Submitted</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredResults.map((row, idx) => (
                      <Table.Row key={idx} _hover={{ bg: "gray.50" }}>
                        <Table.Cell fontWeight="medium">{row.fullName}</Table.Cell>
                        <Table.Cell color="gray.600">{row.email}</Table.Cell>
                        <Table.Cell>
                          {row.score !== null ? (
                            <HStack color="brand.navy" fontWeight="bold">
                              <Icon as={Award} size="xs" />
                              <Text>{row.score} / {row.total}</Text>
                              <Badge colorPalette={row.score! >= (row.total!/2) ? "green" : "red"}>
                                {Math.round((row.score! / row.total!) * 100)}%
                              </Badge>
                            </HStack>
                          ) : (
                            <Text color="gray.400">N/A</Text>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette={row.score !== null ? "green" : "gray"} variant="solid">
                            {row.score !== null ? "Completed" : "Pending"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell color="gray.500" fontSize="sm">
                          {row.date ? (
                            <HStack>
                              <Icon as={Calendar} size="xs" />
                              <Text>{new Date(row.date).toLocaleDateString()} {new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </HStack>
                          ) : "-"}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
            {!isLoading && filteredResults.length === 0 && (
              <Box p={12} textAlign="center">
                <Text color="gray.500">No students found matching your search.</Text>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
