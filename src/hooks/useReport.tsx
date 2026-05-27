import { useState } from "react";
import { reportService } from "../service/Report";
import type { ReportQuery, ReportResponse } from "../types/Report";

export const useReport = () => {
    const [data, setData] = useState<ReportResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await reportService.getReport();
            setData(result);
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal mengambil report");
        } finally {
            setLoading(false);
        }
    }

    const fetchReport = async (query: ReportQuery) => {
        try {
            setLoading(true);
            setError(null);
            const result = await reportService.createReport(query);
            setData(result);
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal mengambil report");
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (query: ReportQuery) => {
        try {
            const blob = await reportService.exportReport(query);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            // Nama file pakai type + month/year dari query
            link.setAttribute(
                "download",
                `report-${query.type}-${query.month ?? "all"}-${query.year ?? ""}.pdf`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // bersihkan object URL setelah download
        } catch (err: any) {
            setError("Gagal export report");
        }
    };

    return {
        data,
        loading,
        error,
        getReport,
        fetchReport,
        exportReport,
    };
};