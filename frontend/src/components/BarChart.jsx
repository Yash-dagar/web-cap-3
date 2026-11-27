// simple horizontal bar chart made with plain CSS (no chart library)
// data = [{ label: 'Dog', value: 5 }, ...]
function BarChart({ title, data }) {
    let max = 0;
    for (const item of data) {
        if (item.value > max) {
            max = item.value;
        }
    }

    return (
        <div className="box">
            <h3>{title}</h3>
            {data.length === 0 && <p className="muted">No data yet</p>}
            {data.map((item) => (
                <div className="bar-row" key={item.label}>
                    <span className="bar-label">{item.label}</span>
                    <div className="bar-track">
                        <div className="bar-fill" style={{ width: (item.value / max) * 100 + '%' }}></div>
                    </div>
                    <span className="bar-value">{item.value}</span>
                </div>
            ))}
        </div>
    );
}

export default BarChart;
