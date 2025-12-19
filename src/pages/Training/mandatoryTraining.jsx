import React, { useState, useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function MandatoryTraining() {

    // -----------------------
    //  DUMMY DATA
    // -----------------------
    const data = {
        by_partner: {
            "242575": [
                { id: 4, partner: "242575", training_name: "Cybersecurity Awareness Training", training_type: "Online", assigned_date: "2025-01-15", due_date: "2025-02-15", completed_date: null, status: "started", certificate: null },
                { id: 7, partner: "242575", training_name: "Cybersecurity Awareness", training_type: "Online", assigned_date: "2025-01-15", due_date: "2025-02-15", completed_date: null, status: "started", certificate: null }
            ],
            "242580": [
                { id: 5, partner: "242580", training_name: "Cybersecurity Awareness Training", training_type: "Online", assigned_date: "2025-01-15", due_date: "2025-02-15", completed_date: null, status: "started", certificate: null },
                { id: 8, partner: "242580", training_name: "Cybersecurity Awareness", training_type: "Online", assigned_date: "2025-01-15", due_date: "2025-02-15", completed_date: "2025-02-11", status: "completed", certificate: "/certificates/Screenshot_2025.png" }
            ],
            "286804": [
                { id: 6, partner: "286804", training_name: "Cybersecurity Awareness Training", training_type: "Online", assigned_date: "2025-01-15", due_date: "2025-02-15", completed_date: "2025-02-11", status: "completed", certificate: "/certificates/Screenshot_2025.png" },
                { id: 9, partner: "286804", training_name: "Cybersecurity Awareness", training_type: "Online", assigned_date: "2025-01-15", due_date: "2025-02-15", completed_date: null, status: "started", certificate: null }
            ]
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        partner: "",
        status: "",
        search: ""
    });

    // Flatten all items
    const items = useMemo(() => {
        return Object.values(data.by_partner).flat();
    }, []);

    // Apply Filters
    const filtered = useMemo(() => {
        return items.filter(item => {
            return (
                (filters.partner === "" || item.partner === filters.partner) &&
                (filters.status === "" || item.status === filters.status) &&
                (filters.search === "" || item.training_name.toLowerCase().includes(filters.search.toLowerCase()))
            );
        });
    }, [filters, items]);

    // Pie chart data
    const statusCount = {
        started: filtered.filter(i => i.status === "started").length,
        completed: filtered.filter(i => i.status === "completed").length,
        notStarted: filtered.filter(i => i.status === "not started").length,
    };

    const pieData = {
        labels: ["Started", "Completed", "Not Started"],
        datasets: [
            {
                data: [statusCount.started, statusCount.completed, statusCount.notStarted],
                backgroundColor: ["#f0ad4e", "#28a745", "#6c757d"],
            }
        ]
    };

    // Bar chart data
    const partners = [...new Set(filtered.map(i => i.partner))];

    const barData = {
        labels: partners,
        datasets: [
            {
                label: "Started",
                backgroundColor: "#f0ad4e",
                data: partners.map(p => filtered.filter(i => i.partner === p && i.status === "started").length)
            },
            {
                label: "Completed",
                backgroundColor: "#28a745",
                data: partners.map(p => filtered.filter(i => i.partner === p && i.status === "completed").length)
            }
        ]
    };

    return (
        <div className="container py-4">

            {/* SUMMARY BOX */}
            <div className="card p-3 mb-4 position-relative">
                <h4>Training Summary (Dummy Data)</h4>
                <p>Total Trainings: {items.length}</p>
                <p>Completed: {statusCount.completed}</p>
                <p>Pending: {statusCount.started + statusCount.notStarted}</p>

                <span
                    className="position-absolute"
                    style={{ right: 20, top: 20, cursor: "pointer", color: "blue" }}
                    onClick={() => setShowModal(true)}
                >
                    Show More
                </span>
            </div>

            {/* MODAL */}
            <Modal show={showModal} backdrop="static" onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Detailed Summary</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <pre>{JSON.stringify(data.by_partner, null, 2)}</pre>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* FILTERS */}
            <div className="card p-3 mb-4">
                <h5>Filters</h5>

                <div className="row">

                    <div className="col-md-3">
                        <label>Partner</label>
                        <select
                            className="form-select"
                            onChange={e => setFilters({ ...filters, partner: e.target.value })}
                        >
                            <option value="">All</option>
                            {Object.keys(data.by_partner).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label>Status</label>
                        <select
                            className="form-select"
                            onChange={e => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All</option>
                            <option value="started">Started</option>
                            <option value="completed">Completed</option>
                            <option value="not started">Not Started</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label>Search</label>
                        <input
                            className="form-control"
                            placeholder="Training name..."
                            onChange={e => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className="col-md-3 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={() => {}}>
                            Search
                        </button>
                    </div>

                </div>
            </div>

            {/* TABLE */}
            <div className="card p-3 mb-4">
                <h5>Training Table</h5>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Partner</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Assigned</th>
                            <th>Due</th>
                            <th>Status</th>
                            <th>Completed</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.partner}</td>
                                <td>{item.training_name}</td>
                                <td>{item.training_type}</td>
                                <td>{item.assigned_date}</td>
                                <td>{item.due_date}</td>
                                <td>{item.status}</td>
                                <td>{item.completed_date ?? "--"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* PIE CHART */}
            <div className="card p-3 mb-4">
                <h5>Completion Status Chart</h5>
                <Pie data={pieData} />
            </div>

            {/* BAR CHART */}
            <div className="card p-3 mb-4">
                <h5>Training Status by Partner</h5>
                <Bar data={barData} />
            </div>

        </div>
    );
}
