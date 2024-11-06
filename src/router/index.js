import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import LoginPage from "@/components/LoginPage.vue";
import DashBoard from "@/components/DashBoard.vue";
import PasswordLink from "@/components/PasswordLink.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import PasswordUpdate from "@/components/PasswordUpdate.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import AdminRegister from "@/components/AdminRegister.vue";



const routes = [
    {path: "/", component: HelloWorld},
    {path: "/login", component: LoginPage},
    {path: "/dashboard", component: DashBoard},
    {path: "/passwordlink", component: PasswordLink},
    {path: "/reset-password/:token", component: ResetPassword},
    {path: "/passwordupdate", component: PasswordUpdate},
    {path: "/signup", component: RegisterPage},




    {path: "/admin/register", component: AdminRegister},




]



const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router; 