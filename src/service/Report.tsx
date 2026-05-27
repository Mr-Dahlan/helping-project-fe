import axios from "../libs/axios";
import type { ReportQuery, ReportResponse } from "../types/Report";

export const reportService = {

    getReport: async (): Promise<ReportResponse> => {
        const res = await axios.get("/reports");
        return res.data;
    },

    // 📊 ambil report — POST body sesuai API spec
    createReport: async (query: ReportQuery): Promise<ReportResponse> => {
        const res = await axios.post("/reports/generate", query);
        console.log(res.data);
        
        return res.data.data;
    },


    // 📄 export laporan PDF — POST body
    exportReport: async (query: ReportQuery): Promise<Blob> => {
        const res = await axios.post("/report/export", query, {
            responseType: "blob",
        });
        return res.data;
    },
};