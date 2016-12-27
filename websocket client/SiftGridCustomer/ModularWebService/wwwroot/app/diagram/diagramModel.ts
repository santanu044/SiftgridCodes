

export class DiagramData{
    public JobID;
    public Title;
    public DrawingNo; 
    public DrawnBy;
    public Date;
    public Company; 
    public Owner ;
    public LSD;
    public Field;
    public Facility; 
    public Subtype;
    public Comment;

    public constructor() {
        this.JobID = '';
        this.Title = '';
        this.DrawingNo = '';
        this.DrawnBy = '';
        this.Date = '';
        this.Company = {'type':'select','value':['Siftgrid','Bizruntime']};
        this.Owner = '';
        this.LSD = '';
        this.Field = '';
        this.Facility = '';
        this.Subtype = '';
        this.Comment = '';
    }
}