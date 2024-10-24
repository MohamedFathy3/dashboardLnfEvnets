export function useCheckDateIsPast(date: string) {
    // Parse the string date into a JavaScript Date object
    const targetDate = new Date(date); // JavaScript can parse "October 24, 2024" directly

    // Get the current date
    const currentDate = new Date();

    // Return true if the target date is in the past
    return targetDate < currentDate;
}
