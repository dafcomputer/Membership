import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

export function successToast(message: string) {
  Swal.fire({
    title: message,
    icon: "success",
    html: `<style>
    .swal2-popup {
      border-radius: 15px !important;
    }
  </style>`,
    timer: 2000,
    timerProgressBar: true,
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
    }
  });
  let timerInterval: any;
}

export function errorToast(message: string, errorDetail?: string) {
  Swal.fire({
    title: message,
    icon: "error",
    html: `
    <style>
        .swal2-popup {
            border-radius: 20px !important;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar {
            max-height: 250px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #b3b3b3 #f0f0f0;
            margin-top: 10px;
            padding: 10px;
            background-color: #fff5f5;
            border-radius: 5px;
            border: 1px solid #f27474;
            transition: max-height 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f0f0f0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #b3b3b3;
            border-radius: 4px;
        }
        .swal2-confirm.custom-dismiss-button {
            background-color: #ff6b6b;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px 15px;
            font-size: 1rem;
            transition: background-color 0.2s ease;
        }
        .swal2-confirm.custom-dismiss-button:hover {
            background-color: #e35757;
        }
        #customButton {
            color: #ff6b6b;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            padding: 5px;
            display: inline-block;
            transition: color 0.2s ease;
        }
        #customButton:hover {
            color: #e35757;
        }
    </style>
    <div style="text-align: center;">
        <a id="customButton" class="swal2-confirm swal2-styled">
            Show Error Details
        </a>
        <div id="errorDetail" class="custom-scrollbar" style="display: none; color: #f27474;">
            ${errorDetail || "No additional error details available"}
        </div>
    </div>
    <hr style="margin: 10px 0;">
    `,
    confirmButtonText: "Dismiss",
    customClass: {
      confirmButton: "custom-dismiss-button",
    },
    didOpen: () => {
      const customButton = document.getElementById("customButton");
      const errorDetailDiv = document.getElementById("errorDetail");
      if (customButton && errorDetailDiv) {
        customButton.addEventListener("click", () => {
          if (errorDetailDiv.style.display === "none") {
            errorDetailDiv.style.display = "block";
            errorDetailDiv.style.maxHeight = "250px";
            customButton.textContent = "Hide Error Details";
          } else {
            errorDetailDiv.style.display = "none";
            customButton.textContent = "Show Error Details";
          }
        });
      }
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
    }
  });
  let timerInterval: any;
}
