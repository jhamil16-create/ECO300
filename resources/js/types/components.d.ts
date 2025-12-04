// Declaraciones de tipos para componentes Vue
declare module '@/Components/InventoryChart.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{
    labels?: string[]
    actual?: number[]
    optimal?: number[]
  }>
  export default component
}

declare module '@/Components/SalesChart.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{
    labels?: string[]
    sales?: number[]
    production?: number[]
  }>
  export default component
}

declare module '@/Components/MetricCard.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{
    title?: string
    value?: string
    trend?: number
    icon?: any
  }>
  export default component
}

declare module '@/Components/AlertsList.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{
    alerts?: any[]
  }>
  export default component
}

