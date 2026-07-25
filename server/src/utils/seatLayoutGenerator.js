/**
 * Generates a dynamic ferry cabin seat layout based on total capacity.
 *
 * Rules:
 * - capacity >= 40  → 2 floors
 * - capacity < 40   → 1 floor
 * - Each floor is split equally left / right with an aisle in between.
 * - Seat IDs encode row number and column letter, e.g. "3A", "3D"
 *
 * @param {number} capacity  Total passenger capacity of the ferry
 * @returns {{ floors: Array, seatConfiguration: Object }}
 */

const LEFT_COLS  = ["A", "B", "C"];
const RIGHT_COLS = ["D", "E", "F"];

/**
 * Pick the column layout that best fits the seats-per-row requirement.
 * @param {number} seatsPerFloor
 */
const resolveColumnLayout = (seatsPerFloor) => {
    if (seatsPerFloor <= 20) {
        // 1 col each side → 2 seats/row
        return { left: ["A"], right: ["D"], perRow: 2 };
    }
    if (seatsPerFloor <= 60) {
        // 2 cols each side → 4 seats/row
        return { left: ["A", "B"], right: ["D", "E"], perRow: 4 };
    }
    // 3 cols each side → 6 seats/row  (standard, max capacity 200)
    return { left: LEFT_COLS, right: RIGHT_COLS, perRow: 6 };
};

/**
 * Generate seats for a single floor.
 * @param {number} floorNumber  1-indexed floor number
 * @param {number} seatsOnFloor Total seats to generate on this floor
 * @returns {{ floor: number, seats: Array }}
 */
const generateFloorSeats = (floorNumber, seatsOnFloor) => {
    const { left, right, perRow } = resolveColumnLayout(seatsOnFloor);
    const totalRows = Math.ceil(seatsOnFloor / perRow);

    // Row offset so that floor-2 row labels continue from floor-1
    const rowOffset = (floorNumber - 1) * totalRows;

    const seats = [];
    let seatsPlaced = 0;

    for (let r = 1; r <= totalRows; r++) {
        const rowLabel = String(rowOffset + r);

        // Left side
        for (const col of left) {
            if (seatsPlaced >= seatsOnFloor) break;
            seats.push({
                seatNumber: `${rowLabel}${col}`,
                side: "left",
                status: "available"
            });
            seatsPlaced++;
        }

        // Right side
        for (const col of right) {
            if (seatsPlaced >= seatsOnFloor) break;
            seats.push({
                seatNumber: `${rowLabel}${col}`,
                side: "right",
                status: "available"
            });
            seatsPlaced++;
        }
    }

    return { floor: floorNumber, seats };
};

/**
 * Main utility: generate full ferry seat layout.
 * @param {number} capacity
 * @returns {{ floors: Array, seatConfiguration: Object }}
 */
const generateSeatLayout = (capacity) => {
    if (!capacity || capacity < 1) {
        throw new Error("Ferry capacity must be at least 1");
    }
    if (capacity > 200) {
        throw new Error("Maximum supported capacity is 200 passengers");
    }

    const totalFloors   = capacity >= 40 ? 2 : 1;
    const seatsPerFloor = Math.ceil(capacity / totalFloors);
    const leftSideSeats = Math.ceil(seatsPerFloor / 2);
    const rightSideSeats = seatsPerFloor - leftSideSeats;

    const seatConfiguration = {
        totalFloors,
        seatsPerFloor,
        leftSideSeats,
        rightSideSeats
    };

    const floors = [];
    let remainingSeats = capacity;

    for (let f = 1; f <= totalFloors; f++) {
        const seatsOnThisFloor = Math.min(seatsPerFloor, remainingSeats);
        floors.push(generateFloorSeats(f, seatsOnThisFloor));
        remainingSeats -= seatsOnThisFloor;
    }

    return { floors, seatConfiguration };
};

module.exports = { generateSeatLayout, resolveColumnLayout };
