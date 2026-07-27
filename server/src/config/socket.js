const { Server } = require("socket.io");
const eventBus = require("../utils/eventBus");

let io = null;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("join:schedule", (scheduleId) => {
            if (!scheduleId || !/^[0-9a-fA-F]{24}$/.test(scheduleId)) {
                return;
            }
            socket.join(`schedule:${scheduleId}`);
        });

        socket.on("leave:schedule", (scheduleId) => {
            if (!scheduleId || !/^[0-9a-fA-F]{24}$/.test(scheduleId)) {
                return;
            }
            socket.leave(`schedule:${scheduleId}`);
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    // Listen to local eventBus emissions and broadcast to Socket clients
    eventBus.on("seat:booked", ({ scheduleId, seatNumbers }) => {
        if (io) {
            io.to(`schedule:${scheduleId}`).emit("seat:booked", { scheduleId, seatNumbers });
        }
    });

    eventBus.on("seat:released", ({ scheduleId, seatNumbers }) => {
        if (io) {
            io.to(`schedule:${scheduleId}`).emit("seat:released", { scheduleId, seatNumbers });
        }
    });

    eventBus.on("ferry:statusChanged", ({ ferryId, status }) => {
        if (io) {
            io.emit("ferry:statusChanged", { ferryId, status });
        }
    });

    eventBus.on("schedule:reviewRequired", ({ scheduleId }) => {
        if (io) {
            io.emit("schedule:reviewRequired", { scheduleId });
        }
    });

    eventBus.on("inquiry:created", (inquiry) => {
        if (io) {
            io.emit("inquiry:created", inquiry);
        }
    });

    eventBus.on("inquiry:resolved", ({ id, status }) => {
        if (io) {
            io.emit("inquiry:resolved", { id, status });
        }
    });

    eventBus.on("alert:created", (alert) => {
        if (io) {
            io.emit("alert:created", alert);
        }
    });

    eventBus.on("alert:updated", (alert) => {
        if (io) {
            io.emit("alert:updated", alert);
        }
    });

    eventBus.on("alert:deleted", ({ id }) => {
        if (io) {
            io.emit("alert:deleted", { id });
        }
    });

    eventBus.on("schedule:created", (schedule) => {
        if (io) {
            io.emit("schedule:created", schedule);
        }
    });

    eventBus.on("schedule:updated", (schedule) => {
        if (io) {
            io.emit("schedule:updated", schedule);
        }
    });

    eventBus.on("schedule:deleted", ({ id }) => {
        if (io) {
            io.emit("schedule:deleted", { id });
        }
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };
