SELECT
	u.*,
	"walletsCounts".COUNT
FROM
	"user" "u"
	LEFT JOIN (
		SELECT
			"w"."ownerId",
			COUNT(1) AS COUNT
		FROM
			"wallet" "w"
		GROUP BY
			"w"."ownerId"
	) "walletsCounts" ON "walletsCounts"."ownerId" = u."id"