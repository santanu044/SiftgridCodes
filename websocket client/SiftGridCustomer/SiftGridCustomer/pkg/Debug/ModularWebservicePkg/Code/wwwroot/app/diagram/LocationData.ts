  
export class LocationData {

    public LocationId: String
    public NodeType: String
    public UWI: String

    public TenantId: String

    public TenantName: String
    public DiagramId: String

    public DiagramName: String

    public CreatedBy: String
    public ModifiedBy: String

    public CreatedDateTime: String
    public ModifiedDataTime: String
    public XCoordinate: String
    public YCoordinate: String
    public IsMissingField: boolean
    public LocationData() { }

    public constructor(LocationId: String, TenantId: String, TenantName: String,
        DiagramId: String, DiagramName: String, NodeType: String,
        UWI: String, CreatedBy: String, ModifiedBy: String,
        CreatedDateTime: String, ModifiedDataTime: String,
        XCoordinate: String, YCoordinate: String, IsMissingField: boolean) {
        this.LocationId = LocationId;
        this.TenantId = TenantId;
        this.TenantName = TenantName;
        this.DiagramId = DiagramId;
        this.DiagramName = DiagramName;

        this.NodeType = NodeType;
        this.UWI = UWI
        this.CreatedBy = CreatedBy
        this.ModifiedBy = ModifiedBy
        this.CreatedDateTime = CreatedDateTime
        this.ModifiedDataTime = ModifiedDataTime
        this.XCoordinate = XCoordinate
        this.YCoordinate = YCoordinate
        this.IsMissingField = IsMissingField

    }
}
