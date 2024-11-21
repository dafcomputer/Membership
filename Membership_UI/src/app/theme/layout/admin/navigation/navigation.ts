import { Injectable } from "@angular/core";

export interface NavigationItem {
  id: string;
  title: string;
  type: "item" | "collapse" | "group";
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  role: string;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "default",
        title: "Admin-Dashboard",
        type: "item",
        classes: "nav-item",
        role: ["Admin", "SuperAdmin", "RegionAdmin"],
        url: "/admin-dashboard",
        icon: "ti ti-dashboard",
        breadcrumbs: false,
      },
      {
        id: "default",
        title: "Member-Dashboard",
        type: "item",
        classes: "nav-item",
        role: ["Member"],
        url: "/member-dashboard",
        icon: "ti ti-dashboard",
        breadcrumbs: false,
      },
    ],
  },
  {
    id: "page2",
    title: "Membership",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "profile",
        title: "Profile",
        type: "item",
        role: ["Member"],
        icon: "ti ti-user-check",
        url: "/members/member-profile",
        breadcrumbs: false,
      },
      {
        id: "announcment",
        title: "Announcment",
        type: "item",
        role: ["Member"],
        icon: "ti ti-bookmark",
        url: "/members/member-announcment",
        breadcrumbs: false,
      },
      {
        id: "Events",
        title: "Events",
        type: "item",
        role: ["Member"],
        icon: "ti ti-link",
        url: "/members/member-course",
        breadcrumbs: false,
      },

      {
        id: "data",
        title: "Members",
        type: "item",
        role: ["Admin", "SuperAdmin"],
        icon: "ti ti-users",
        url: "/members/List",
        breadcrumbs: false,
      },
      {
        id: "data",
        title: "Message Management",
        type: "item",
        role: ["Admin", "SuperAdmin"],
        icon: "ti ti-message",
        url: "/members/messages",
        breadcrumbs: false,
      },
      {
        id: "requestd",
        title: "Requested Id Cards",
        type: "item",
        role: ["Admin", "SuperAdmin"],
        icon: "ti ti-layout",
        url: "/members/idcard",
        breadcrumbs: false,
      },
      {
        id: "Authentication",
        title: "Reports",
        type: "collapse",
        role: ["Admin", "SuperAdmin", "RegionAdmin"],
        icon: "ti ti-book",
        children: [
          {
            id: "data",
            title: "Membership Report ",
            type: "item",
            role: ["Admin", "SuperAdmin", "RegionAdmin"],
            url: "/reports/membership-report",
            breadcrumbs: false,
          },
          {
            id: "total-revune",
            title: "Total Revenue",
            type: "item",
            role: ["Admin", "SuperAdmin", "RegionAdmin"],
            url: "/reports/total-revenue",
            breadcrumbs: false,
          },
        ],
      },
      {
        id: "Authentication",
        title: "Configuration",
        type: "collapse",
        role: ["Admin", "SuperAdmin"],
        icon: "ti ti-settings",
        children: [
          {
            id: "data",
            title: "Membership Types ",
            type: "item",
            role: ["Admin", "SuperAdmin"],
            url: "/configuration/membership-types",
            breadcrumbs: false,
          },

          {
            id: "data",
            title: "Location Settings",
            type: "item",
            role: ["Admin", "SuperAdmin"],
            url: "/configuration/location-setting",
            breadcrumbs: false,
          },
        ],
      },
    ],
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
