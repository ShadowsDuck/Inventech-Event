import { createFileRoute } from '@tanstack/react-router'
import login from '@/features/login/component/login'
export const Route = createFileRoute('/login/')({
  component: login,
})

