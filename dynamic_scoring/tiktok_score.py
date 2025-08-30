def clamp(x, lo, hi):
    """Restrict x to the range [lo, hi]."""
    return max(lo, min(x, hi))


def reward_percent(
    # Fraud Gate
    gate_score,  # 0 = malicious, 1 = clean (or float [0,1] if soft gate)
    # Market & Category
    market_health,
    category_weight,  # inputs in [0.8–1.2]
    base_min=0.8,
    base_max=1.2,  # clamp for Base multiplier
    # Content / Interaction Quality
    content_quality=0.5,
    interaction_quality=0.5,  # scores [0–1]
    weight_content_quality=0.5,
    weight_interaction_quality=0.5,  # adjustable weights
    quality_min=0.0,
    quality_max=1.0,  # clamp for quality adjustment
    # Temporal Engagement
    immediate_engagement=0.5,
    weekly_engagement=0.5,  # normalized [0–1]
    w_immediate_engagement=0.3,
    w_weekly_engagement=0.7,  # weights
    temporal_min=0.5,
    temporal_max=1.0,  # clamp for temporal multiplier
    # Global scaling + payout bounds
    scaler=0.5833,  # tuned so best case ~70%
    payout_min=0.10,
    payout_max=0.70,
):
    # ----- Base -----
    base_raw = 0.5 * market_health + 0.5 * category_weight
    base_score = clamp(base_raw, base_min, base_max)

    # ----- AI Adjusted (Content + Interaction Quality) -----
    quality_score = (
        weight_content_quality * content_quality
        + weight_interaction_quality * interaction_quality
    )
    ai_adjusted = clamp(quality_score, quality_min, quality_max)

    # ----- Temporal (blend of immediate + weekly engagement) -----
    temporal_raw = 0.5 + 0.5 * (
        w_immediate_engagement * immediate_engagement
        + w_weekly_engagement * weekly_engagement
    )
    temporal_score = clamp(temporal_raw, temporal_min, temporal_max)

    # ----- Final Reward % -----
    if gate_score == 0:  # proven malicious
        return 0.0

    raw_reward = scaler * base_score * ai_adjusted * temporal_score
    return clamp(raw_reward, payout_min, payout_max)


# ----------------------------
# Test Cases: 4 Personas
# ----------------------------

"""
Fraud_Model -> Gate_score [0,1]
    - Authencitiy of users
    -
Content_Quality_Model -> Content_Quality_score [0-1]
Interaction_Quality_Model -> Interaction_Quality_Score [0-1]
"""


personas = {
    "Popular, high-quality": {
        "gate_score": 1,
        "market_health": 1.10,
        "category_weight": 1.20,
        "content_quality": 0.9,
        "interaction_quality": 0.9,
        "immediate_engagement": 0.95,
        "weekly_engagement": 0.90,
    },
    "Less-popular, high-quality": {
        "gate_score": 1,
        "market_health": 1.05,
        "category_weight": 1.00,
        "content_quality": 0.8,
        "interaction_quality": 0.8,
        "immediate_engagement": 0.70,
        "weekly_engagement": 0.75,
    },
    "Less-popular, low-quality": {
        "gate_score": 1,
        "market_health": 1.00,
        "category_weight": 0.90,
        "content_quality": 0.3,
        "interaction_quality": 0.3,
        "immediate_engagement": 0.40,
        "weekly_engagement": 0.50,
    },
    "Malicious actor": {
        "gate_score": 0,  # fails the fraud gate
        "market_health": 1.00,
        "category_weight": 1.00,
        "content_quality": 0.1,
        "interaction_quality": 0.1,
        "immediate_engagement": 0.20,
        "weekly_engagement": 0.20,
    },
}

for name, params in personas.items():
    pct = reward_percent(**params)
    print(f"{name:30s} → Reward = {pct*100:.2f}%  |  Take-home on $50 = ${pct*50:.2f}")
