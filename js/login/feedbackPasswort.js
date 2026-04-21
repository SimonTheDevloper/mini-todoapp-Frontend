export function getFeedbackToPasswort(password) {
    const result = zxcvbn(password || "");
    const score = result.score;

    const stärkeÜbersicht = [
        { text: "very weak" },
        { text: "weak" },
        { text: "okay" },
        { text: "strong" },
        { text: "very strong" }
    ];

    return {
        score,
        text: stärkeÜbersicht[score].text,
        feedback: result.feedback
    };
}