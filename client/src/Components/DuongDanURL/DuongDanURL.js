import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Search from "../Search/Search";
import UpdateRecruitment from "../UpdateRecruitment/UpdateRecruitment";
import PrivateRouter from "../../ProtectingRouter/PrivateRouter";
import UnPrivateRouter from "../../ProtectingRouter/UnPrivateRouter";
import DetailRecruitment from "../DetailRecruitment/DetailRecruitment";
import MyRecruitment from "../MyRecruitment/MyRecruitment";
import Account from "../Admin/Account/Account";
import Recruitment from "../Admin/Recruitment/Recruitment";
import RecruitmentFalse from "../Admin/Recruitment/RecruitmentFalse";
import HoSo from "../HoSo/Mail";
import HoSoChecked from "../HoSo/MailChecked";
import LinhVucChart from "../Admin/Charts/LinhVucChart";
import NotFound from "../NotFound/NotFound";
import SearchCityOrCareer from "../Search/SearchCityOrCareer";
import Profile from "../Profile/Profile";
import CreateProfile from "../Profile/CreateProfile";
import UpdateProfile from "../Profile/UpdateProfile";
import MyCV from "../MyCV/MyCV";
import CreateSubscriptionPackage from "../Admin/CreateSubscriptionPackage";
import AdminPurchasedSubscriptions from "../Admin/AdminPurchasedSubscriptions";
import SubscriptionPackages from "../SubscriptionPackages/SubscriptionPackages";
import MySubscriptions from "../SubscriptionPackages/MySubscriptions";
import PostRecruitment from "../PostRecruitment/PostRecruitment";
import PaymentSuccess from "../payments/PaymentSuccess";
import PaymentCancel from "../payments/PaymentCancel";
function DuongDanURL() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <UnPrivateRouter path="/login" component={Login} />
      <UnPrivateRouter path="/register" component={Register} />
      <PrivateRouter
        path="/postRecruitment"
        roles={["recruiter", "admin", "spadmin"]}
        component={PostRecruitment}
      />
      <PrivateRouter
        path="/updateRecruitment/:id"
        roles={["recruiter", "admin", "spadmin"]}
        component={UpdateRecruitment}
      />
      <Route path="/search" component={Search} />
      <Route path="/recruitment/:id" component={DetailRecruitment} />
      <PrivateRouter
        path="/myRecruitment/:id-page=:page"
        roles={["recruiter", "admin", "spadmin"]}
        component={MyRecruitment}
      />
      <PrivateRouter
        path="/admin/account/:id&page=:page"
        roles={["admin", "spadmin"]}
        component={Account}
      />
      <PrivateRouter
        path="/admin/recruitment/:id&page=:page&true"
        roles={["admin", "spadmin"]}
        component={Recruitment}
      />
      <PrivateRouter
        path="/admin/recruitment/:id&page=:page&false"
        roles={["admin", "spadmin"]}
        component={RecruitmentFalse}
      />
      <PrivateRouter
        path="/admin/create-subscription"
        roles={["admin", "spadmin"]}
        component={CreateSubscriptionPackage}
      />
      <PrivateRouter
        path="/admin/purchased-subscriptions"
        roles={["admin", "spadmin"]}
        component={AdminPurchasedSubscriptions}
      />
      <PrivateRouter
        path="/subscription-packages"
        roles={["recruiter"]}
        component={SubscriptionPackages}
      />
      <PrivateRouter
        path="/my-subscriptions"
        roles={["recruiter"]}
        component={MySubscriptions}
      />
      <PrivateRouter
        path="/mail/:id&false&page=:page"
        roles={["admin", "spadmin", "recruiter"]}
        component={HoSo}
      />
      <PrivateRouter
        path="/mail/:id&true&page=:page"
        roles={["admin", "spadmin", "recruiter"]}
        component={HoSoChecked}
      />
      <PrivateRouter
        path="/thongke"
        roles={["admin", "spadmin"]}
        component={LinhVucChart}
      />
      <PrivateRouter
        path="/profile"
        roles={["candidate"]}
        component={Profile}
      />
      <PrivateRouter
        path="/:id/createProfile"
        roles={["candidate"]}
        component={CreateProfile}
      />
      <PrivateRouter
        path="/:person/updateProfile"
        roles={["candidate"]}
        component={UpdateProfile}
      />
      <PrivateRouter
        path="/myCV/:id-page=:page"
        roles={["candidate"]}
        component={MyCV}
      />
      <PrivateRouter
        path="/payment-success"
        roles={["recruiter"]}
        component={PaymentSuccess}
      />
      <PrivateRouter
        path="/payment-cancel"
        roles={["recruiter"]}
        component={PaymentCancel}
      />
      <Route path="/:id/search=:thanhpho" component={SearchCityOrCareer} />
      <Route path="/payment/success" component={PaymentSuccess} />{" "}
      {/* Thêm route */}
      <Route path="/payment/cancel" component={PaymentCancel} />{" "}
      {/* Thêm route */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

export default DuongDanURL;
