import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Provider as ChakraProvider } from '@components/ui/provider'


// Create a client
const queryClient = new QueryClient()

const AppProviders = ({ children }: { children: React.ReactNode }) => {

    return (
        <ChakraProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ChakraProvider>
    )
}

export default AppProviders;    