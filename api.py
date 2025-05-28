from flask import Flask, request, jsonify
import pandas as pd
from pbixray.core import PBIXRay


def sizeof_fmt(num, suffix="B"):
    for unit in ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"):
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"


app = Flask(__name__)


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith(".pbix"):

        model = PBIXRay(file)
        schema_df = model.schema.copy()
        calculated_df = model.dax_columns.copy()

        # Add missing columns to align structure
        for col in schema_df.columns:
            if col not in calculated_df.columns:
                calculated_df[col] = None
        for col in calculated_df.columns:
            if col not in schema_df.columns:
                schema_df[col] = None
        merged_table = pd.concat([schema_df, calculated_df], ignore_index=True)

        table_data = {}
        for table in model.tables:
            table_data[table] = model.get_table(table).to_dict(orient="records")

        response = {
            "metadata": model.metadata.to_dict(orient="records"),
            "model_size": sizeof_fmt(model.size),
            "number_of_tables": model.tables.size,
            "columns": merged_table.to_dict(orient="records"),
            "tables": model.statistics.to_dict(orient="records"),
            "relationships": (
                model.relationships.to_dict(orient="records")
                if model.relationships.size
                else []
            ),
            "power_query": (
                model.power_query.to_dict(orient="records")
                if model.power_query.size
                else []
            ),
            "measures": (
                model.dax_measures.to_dict(orient="records")
                if model.dax_measures.size
                else []
            ),
            "table_data": table_data,
        }
        return jsonify(response), 200

    return jsonify({"error": "Invalid file type"}), 400


if __name__ == "__main__":
    app.run(debug=True)
